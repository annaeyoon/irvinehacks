// server.js
import express from 'express';
import AWS from 'aws-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';

// Load environment variables from the .env file
dotenv.config();

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up AWS credentials and region
AWS.config.update({
  accessKeyId: 'AKIAZDZTBZEFWWX5YADK',  // Replace with your IAM access key
  secretAccessKey: process.env.S3_SECRET_KEY,  // Replace with your IAM secret key
  region: 'us-east-1'  // e.g., 'us-west-2'
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage();  // Store file in memory (you can also use diskStorage)
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 's3.html'));
});


// Route to get a file from S3
app.get('/vacations/:key', (req, res) => {
  const key = req.params.key;  
  console.log(`Requested file key: ${key}`);

  const params = {
    Bucket: 'irvinehacks2025',  
    Key: 'vacations/' + key,  
  };

  s3.getObject(params, (err, data) => {
    
    if (err) {
      console.log(err);
      console.log(params);
      return res.status(500).send('Error fetching file');
    }
    // Set the correct content type based on file extension
    const fileExtension = path.extname(key).toLowerCase();
    let contentType = 'application/octet-stream';  // Default content type

    if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (fileExtension === '.png') {
      contentType = 'image/png';
    } else if (fileExtension === '.gif') {
      contentType = 'image/gif';
    }

    // Set proper content-type header
    res.setHeader('Content-Type', contentType);

    // Send the S3 file content as the response
    res.send(data.Body);

  });
});

// Route to upload file to S3
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const params = {
    Bucket: 'irvinehacks2025',  
    Key: 'uploads/ayoon/' + req.file.originalname,  // The object key (filename)
    Body: req.file.buffer,  // The file content
    ContentType: req.file.mimetype,
    ACL: 'public-read'  // Set the file to be publicly readable
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error uploading file');
    }

    res.send(`File uploaded successfully: ${data.Location}`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
