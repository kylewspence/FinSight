import path from 'node:path';
import multer from 'multer';
import fs from 'node:fs';

// Define upload directory for CSV files
const csvDirectory = 'uploads/csv';

// Make sure directory exists
if (!fs.existsSync(csvDirectory)) {
  fs.mkdirSync(csvDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, csvDirectory);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    const name = `${fileName}-${Date.now()}${fileExtension}`;
    callback(null, name);
  },
});

// Create middleware with CSV-specific options
export const csvUploadsMiddleware = multer({
  storage,
  fileFilter: (req, file, callback) => {
    // Only accept CSV files
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      callback(null, true);
    } else {
      callback(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});
