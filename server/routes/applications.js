const express = require('express');
const { check } = require('express-validator');
const Application = require('../models/Application');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// @desc    Get all applications
// @route   GET /api/applications
// @route   GET /api/courses/:courseId/applications
// @access  Private/Admin
router.get(
  '/',
  [protect, authorize('admin', 'instructor')],
  advancedResults(Application, [
    {
      path: 'user',
      select: 'name email',
    },
    {
      path: 'course',
      select: 'title',
    },
  ]),
  asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  })
);

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private/Admin
router.get(
  '/:id',
  [protect, authorize('admin', 'instructor')],
  asyncHandler(async (req, res, next) => {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'course',
        select: 'title description',
      });

    if (!application) {
      return next(
        new ErrorResponse(`No application with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is application owner or admin
    if (
      application.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this application`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  })
);

// @desc    Add application
// @route   POST /api/courses/:courseId/applications
// @access  Private
router.post(
  '/',
  [
    protect,
    authorize('user'),
    [
      check('phone', 'Please add a phone number').not().isEmpty(),
      check('address', 'Please add an address').not().isEmpty(),
      check('education', 'Please add education details').not().isEmpty(),
    ],
  ],
  asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;
    req.body.course = req.params.courseId;

    // Check for existing application
    const existingApplication = await Application.findOne({
      user: req.user.id,
      course: req.params.courseId,
    });

    if (existingApplication) {
      return next(
        new ErrorResponse(
          `User has already applied for this course`,
          400
        )
      );
    }

    const application = await Application.create(req.body);

    res.status(201).json({
      success: true,
      data: application,
    });
  })
);

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
router.put(
  '/:id/status',
  [
    protect,
    authorize('admin', 'instructor'),
    [
      check('status', 'Please provide a valid status')
        .isIn(['pending', 'approved', 'rejected']),
      check('notes', 'Please provide notes for status change').optional(),
    ],
  ],
  asyncHandler(async (req, res, next) => {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return next(
        new ErrorResponse(`No application with the id of ${req.params.id}`, 404)
      );
    }

    // Update status and processed info
    application.status = req.body.status;
    application.processedAt = Date.now();
    application.processedBy = req.user.id;
    if (req.body.notes) {
      application.notes = req.body.notes;
    }

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
    });
  })
);

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
router.delete(
  '/:id',
  [protect, authorize('admin')],
  asyncHandler(async (req, res, next) => {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return next(
        new ErrorResponse(`No application with the id of ${req.params.id}`, 404)
      );
    }

    await application.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  })
);

module.exports = router;
