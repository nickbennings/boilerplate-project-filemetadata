const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a Schema for file metadata
const FileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  date: { type: Date, default: Date.now }
});

const File = mongoose.model('File', FileSchema);

// Middleware
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Multer Configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).single('file');

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Updated /api/upload route handler
app.post('/api/upload', (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ error: 'File upload error' });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ error: 'Unknown error' });
    }

    // File upload was successful. Save file metadata to MongoDB.
    const { originalname, mimetype, size } = req.file;

    try {
      const newFile = new File({ name: originalname, type: mimetype, size: size });
      await newFile.save();
      // Send JSON response with file metadata
      res.json({ name: originalname, type: mimetype, size: size });
    } catch (error) {
      console.error('Error saving file metadata to MongoDB:', error);
      // Send JSON response in case of error
      res.status(500).json({ error: 'Error saving file metadata to MongoDB' });
    }
  });
});
