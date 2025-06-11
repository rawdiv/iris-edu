const express = require('express');
const { check, validationResult } = require('express-validator');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  })
);

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
      path: 'instructor',
      select: 'name email'
    });

    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: course
    });
  })
);

// @desc    Add course
// @route   POST /api/courses
// @access  Private
router.post(
  '/',
  [
    protect,
    authorize('admin', 'instructor'),
    [
      check('title', 'Please add a title').not().isEmpty(),
      check('description', 'Please add a description').not().isEmpty(),
      check('category', 'Please add a category').not().isEmpty(),
      check('duration', 'Please add duration in weeks').isNumeric(),
      check('price', 'Please add a price').isNumeric()
    ]
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    // Add user to req.body
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  })
);

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'instructor'),
    [
      check('title', 'Please add a title').optional().not().isEmpty(),
      check('description', 'Please add a description').optional().not().isEmpty(),
      check('category', 'Please add a category').optional().not().isEmpty(),
      check('duration', 'Please add duration in weeks').optional().isNumeric(),
      check('price', 'Please add a price').optional().isNumeric()
    ]
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this course`,
          401
        )
      );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  })
);

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
router.delete(
  '/:id',
  [protect, authorize('admin', 'instructor')],
  asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this course`,
          401
        )
      );
    }

    await course.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  })
);

module.exports = router;
