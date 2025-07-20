// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 8080;

// === Database connection ===
const db = new sqlite3.Database('./loan.db', (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Make DB accessible in routes
app.locals.db = db;

// === Middleware ===
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// === Routes ===
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const customerRoutes = require('./routes/customers');
const depositRoutes = require('./routes/deposits');
const reportsRoutes = require('./routes/reports'); // ✅ Reports route

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/deposits', depositRoutes);
app.use('/reports', reportsRoutes); // ✅ Mount report route

// === GET: Login Page ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

// === POST: Login ===
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.get(query, [username, password], (err, row) => {
    if (err) {
      console.error('❌ DB error during login:', err.message);
      return res.status(500).send('Internal server error');
    }

    if (row) {
      res.redirect('/pages/dashboard.html');
    } else {
      res.status(401).send('Invalid username or password');
    }
	if (res.ok) {
  alert('Excel uploaded and data imported successfully!');
  loadCustomers(); // ✅ This should repopulate the grid
}

  });
});

// === API: Dashboard Graph Data ===
app.get('/api/dashboard-stats', (req, res) => {
  const query = `
    SELECT start_date, GROUP_CONCAT(name, ', ') AS names, COUNT(*) AS count
    FROM customers
    GROUP BY start_date
    ORDER BY start_date;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching dashboard stats:', err.message);
      return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
    res.json(rows);
  });
});

// === DELETE: Customer by ID ===
app.delete('/customers/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM customers WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      console.error('❌ Error deleting customer:', err.message);
      return res.status(500).json({ message: 'Failed to delete customer' });
    }

    res.json({ success: true, deletedId: id });
  });
});

// === 404 Fallback ===
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// === Start Server ===
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
