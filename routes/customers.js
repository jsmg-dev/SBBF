const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../db');

// ✅ Helper functions
function calculateEndDate(startDate, days = 100) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function calculateAmountAfterDeduction(loan_amount, file_charge, agent_fee, emi, advance_days) {
  return loan_amount - file_charge - agent_fee - (emi * advance_days);
}

// ✅ Create a new customer
router.post('/create', (req, res) => {
  let {
    customer_code, name, contact_no, alt_contact_no,
    start_date, end_date, loan_duration, loan_amount,
    file_charge, agent_fee, emi, advance_days,
    amount_after_deduction, agent_commission, status, remark
  } = req.body;

  if (!customer_code || !name || !contact_no || !start_date || !loan_duration || !loan_amount) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  loan_amount = parseFloat(loan_amount) || 0;
  file_charge = parseFloat(file_charge) || 0;
  agent_fee = parseFloat(agent_fee) || 0;
  emi = parseFloat(emi) || 0;
  advance_days = parseInt(advance_days) || 0;
  amount_after_deduction = parseFloat(amount_after_deduction) || 0;
  agent_commission = parseFloat(agent_commission) || 0;
  loan_duration = parseInt(loan_duration) || 0;

  if (!end_date) {
    end_date = calculateEndDate(start_date);
  }

  if (!amount_after_deduction || amount_after_deduction === 0) {
    amount_after_deduction = calculateAmountAfterDeduction(
      loan_amount, file_charge, agent_fee, emi, advance_days
    );
  }

  const query = `
    INSERT INTO customers (
      customer_code, name, contact_no, alt_contact_no,
      start_date, end_date, loan_duration, loan_amount,
      file_charge, agent_fee, emi, advance_days,
      amount_after_deduction, agent_commission, status, remark
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    customer_code, name, contact_no, alt_contact_no || '',
    start_date, end_date, loan_duration, loan_amount,
    file_charge, agent_fee, emi, advance_days,
    amount_after_deduction, agent_commission,
    status || 'active', remark || ''
  ];

  db.run(query, params, function(err) {
    if (err) {
      console.error('❌ Error inserting customer:', err.message);
      return res.status(500).json({ error: 'Failed to create customer' });
    }
    res.status(201).json({ message: 'Customer created successfully', customerId: this.lastID });
  });
});

// ✅ Return basic customer list (used in dropdowns)
router.get('/list', (req, res) => {
  db.all(`SELECT id, name, customer_code FROM customers ORDER BY name ASC`, [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching customers:', err.message);
      return res.status(500).json({ error: 'Failed to fetch customers' });
    }
    res.json(rows);
  });
});

// ✅ Template download route
router.get('/template', (req, res) => {
  const filePath = path.join(__dirname, '../template/customer-template.xlsx');
  res.download(filePath, 'customer-template.xlsx');
});

// ✅ Upload Excel to bulk import customers
const upload = multer({ dest: 'uploads/' });

router.post('/upload-excel', upload.single('excel'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const insertStmt = db.prepare(`
      INSERT INTO customers (
        customer_code, name, contact_no, alt_contact_no,
        start_date, end_date, loan_duration, loan_amount,
        file_charge, agent_fee, emi, advance_days,
        amount_after_deduction, agent_commission, status, remark
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      for (const row of data) {
        try {
          insertStmt.run([
            row.customer_code || '',
            row.name || '',
            row.contact_no || '',
            row.alt_contact_no || '',
            row.start_date || '',
            row.end_date || calculateEndDate(row.start_date),
            parseInt(row.loan_duration) || 0,
            parseFloat(row.loan_amount) || 0,
            parseFloat(row.file_charge) || 0,
            parseFloat(row.agent_fee) || 0,
            parseFloat(row.emi) || 0,
            parseInt(row.advance_days) || 0,
            calculateAmountAfterDeduction(
              parseFloat(row.loan_amount) || 0,
              parseFloat(row.file_charge) || 0,
              parseFloat(row.agent_fee) || 0,
              parseFloat(row.emi) || 0,
              parseInt(row.advance_days) || 0
            ),
            parseFloat(row.agent_commission) || 0,
            row.status || 'active',
            row.remark || ''
          ]);
        } catch (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            console.warn(`⚠️ Skipped duplicate: ${row.customer_code}`);
            continue;
          } else {
            console.error('❌ Unexpected DB error:', err.message);
          }
        }
      }
      db.run('COMMIT');
    });

    insertStmt.finalize();
    fs.unlinkSync(req.file.path);
    res.json({ message: 'Customers imported successfully' });
  } catch (err) {
    console.error('❌ Excel import error:', err);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

module.exports = router;
