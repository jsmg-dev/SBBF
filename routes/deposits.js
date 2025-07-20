const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

// ✅ Create deposits table with customer_code and customer_name only
db.run(`
  CREATE TABLE IF NOT EXISTS deposits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_code TEXT NOT NULL,
    customer_name TEXT,
    amount REAL NOT NULL,
    penalty REAL DEFAULT 0,
    date TEXT NOT NULL,
    FOREIGN KEY (customer_code) REFERENCES customers(customer_code)
  )
`);

// ✅ POST: Add new deposit
router.post('/create', (req, res) => {
  const { customer_code, customer_name, amount, penalty, date } = req.body;

  if (!customer_code || !amount || !date) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const insertQuery = `
    INSERT INTO deposits (customer_code, customer_name, amount, penalty, date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(insertQuery, [customer_code, customer_name || '', amount, penalty || 0, date], function (err) {
    if (err) {
      console.error('❌ Deposit insert error:', err.message);
      return res.status(500).json({ error: 'Failed to save deposit' });
    }

    res.status(201).json({
      message: '✅ Deposit recorded successfully',
      depositId: this.lastID,
    });
  });
});

// ✅ GET: List all deposits with joined customer info
router.get('/list', (req, res) => {
  const query = `
    SELECT d.*, c.name AS customer_name_db
    FROM deposits d
    LEFT JOIN customers c ON d.customer_code = c.customer_code
    ORDER BY d.date DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching deposits:', err.message);
      return res.status(500).json({ error: 'Failed to fetch deposits' });
    }

    res.json(rows);
  });
});

// ✅ Excel Upload Route
const upload = multer({ dest: 'uploads/' });

router.post('/upload-excel', upload.single('excel'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const stmt = db.prepare(`
      INSERT INTO deposits (customer_code, customer_name, amount, penalty, date)
      VALUES (?, ?, ?, ?, ?)
    `);

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      for (const row of data) {
        try {
          const customer_code = row.customer_code;
          const customer_name = row.customer_name || '';
          const amount = parseFloat(row.amount);
          const penalty = parseFloat(row.penalty) || 0;
          const date = new Date(row.date);

          if (!customer_code || !amount || isNaN(date.getTime())) {
            console.warn('⚠️ Skipped row due to missing or invalid data:', row);
            continue;
          }

          stmt.run(
            customer_code,
            customer_name,
            amount,
            penalty,
            date.toISOString().split('T')[0]
          );
        } catch (err) {
          console.error('❌ Error inserting row:', err.message);
        }
      }
      db.run('COMMIT');
    });

    fs.unlinkSync(req.file.path); // Clean up uploaded file
    res.json({ message: '✅ Deposits imported successfully' });
  } catch (err) {
    console.error('❌ Excel upload error:', err.message);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

module.exports = router;
