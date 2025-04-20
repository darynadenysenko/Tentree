const multer = require('multer');
const path = require('path');

// Set up the storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Make the filename unique using timestamp
  }
});

const upload = multer({ storage: storage });

module.exports = upload;  // Export the upload configuration
