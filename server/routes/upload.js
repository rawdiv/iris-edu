const express = require('express');
const path = require('path');
const fileUpload = require('../middleware/fileUpload');
const { protect, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const router = express.Router();

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
router.post(
  '/',
  [protect, authorize('admin', 'instructor')],
  asyncHandler(async (req, res, next) => {
    fileUpload(req, res, (err) => {
      if (err) {
        return next(new ErrorResponse(`Upload failed: ${err.message}`, 400));
      }
      
      if (!req.file) {
        return next(new ErrorResponse('Please upload a file', 400));
      }

      res.status(200).json({
        success: true,
        data: `/uploads/${req.file.filename}`
      });
    });
  })
);

module.exports = router;
