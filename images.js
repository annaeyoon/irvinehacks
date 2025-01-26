import express from 'express';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname and __filename equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'database-irvine.cn2ymqgeihdj.us-east-1.rds.amazonaws.com',
  user: 'admin',        // your MySQL username
  password: 'adminpw!', // your MySQL password
  database: 'irvinedb'        // your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'images.html'));
});

// Route to serve the index.html file
app.get('/users', (req, res) => {
  // Query the users table to get usernames
  db.query('SELECT username FROM users', (err, results) => {
    if (err) {
      console.log('Error querying database:', err);
      res.status(500).send('Error retrieving data');
      return;
    }

    // Send the list of usernames as a response
    res.json(results);
  });
});


// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});