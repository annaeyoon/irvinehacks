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
  host: 'localhost',
  user: 'test_user',        // your MySQL username
  password: 'testpassword', // your MySQL password
  database: 'testdb'        // your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});
// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'images.html'));
});

// Route to serve images
app.get('/image/:id', (req, res) => {
  const id = req.params.id;

  // Query to get image from database
  db.query('SELECT file_data, filename FROM files WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.log('Error retrieving image:', err);
      return res.status(500).send('Server Error');
    }

    if (results.length > 0) {
      const fileData = results[0].file_data;
      const filename = results[0].filename;
      const ext = path.extname(filename).toLowerCase();

      // Determine the content-type based on file extension
      let contentType = 'application/octet-stream'; // Default type

      if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
      } else if (ext === '.png') {
        contentType = 'image/png';
      } else if (ext === '.gif') {
        contentType = 'image/gif';
      }

      // Send the image as a response with the appropriate content type
      res.setHeader('Content-Type', contentType);
      res.send(fileData);
    } else {
      res.status(404).send('Image not found');
    }
  });
});


// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});