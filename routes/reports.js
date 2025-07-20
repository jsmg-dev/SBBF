// routes/reports.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { Parser } = require('json2csv');

// Fetch customer details between two dates
router.get('/generate', (req, res) => {
  const { type, start, end } = req.query;

  if (!type || !start || !end) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  if (type === 'customer') {
    const query = `
      SELECT id, customer_code, name, contact_no, start_date, end_date, loan_amount, status
      FROM customers
      WHERE DATE(start_date) BETWEEN ? AND ?
      ORDER BY start_date ASC
    `;

    db.all(query, [start, end], (err, rows) => {
      if (err) {
        console.error('❌ DB error fetching customer report:', err.message);
        return res.status(500).json({ error: 'Failed to fetch customer report' });
      }
      res.json(rows);
    });
  } else {
    res.status(400).json({ error: 'Unsupported report type' });
  }
});

// Export as CSV
router.get('/export', (req, res) => {
  const { type, start, end } = req.query;

  if (!type || !start || !end) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  if (type === 'customer') {
    const query = `
      SELECT id, customer_code, name, contact_no, start_date, end_date, loan_amount, status
      FROM customers
      WHERE DATE(start_date) BETWEEN ? AND ?
      ORDER BY start_date ASC
    `;

    db.all(query, [start, end], (err, rows) => {
      if (err) {
        console.error('❌ DB error exporting report:', err.message);
        return res.status(500).json({ error: 'Failed to export report' });
      }

      const parser = new Parser();
      const csv = parser.parse(rows);

      res.header('Content-Type', 'text/csv');
      res.attachment('customer_report.csv');
      res.send(csv);
    });
  } else {
    res.status(400).json({ error: 'Unsupported report type for export' });
  }
});

module.exports = router;
