const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.FILE_UPLOAD_PATH}/`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png, gif)'));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: process.env.MAX_FILE_UPLOAD * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('file');

// Handle file upload
const fileUpload = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Upload Error: ${err.message}`, 400));
    } else {
      if (req.file === undefined) {
        return next(new ErrorResponse('No file selected', 400));
      }

      res.status(200).json({
        success: true,
        data: req.file.filename,
      });
    }
  });
});

module.exports = fileUpload;
