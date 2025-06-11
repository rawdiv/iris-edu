const express = require('express');
const { check } = require('express-validator');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get(
  '/',
  [protect, authorize('admin')],
  advancedResults(User, 'courses'),
  asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  })
);

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
router.get(
  '/:id',
  [protect, authorize('admin')],
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  })
);

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    [
      check('name', 'Please add name').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 }),
    ],
  ],
  asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  })
);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put(
  '/:id',
  [
    protect,
    authorize('admin'),
    [
      check('name', 'Please add name').optional().not().isEmpty(),
      check('email', 'Please include a valid email').optional().isEmail(),
      check('role', 'Please specify a valid role')
        .optional()
        .isIn(['user', 'instructor', 'admin']),
    ],
  ],
  asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Don't allow updating password through this route
    if (req.body.password) {
      delete req.body.password;
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  })
);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete(
  '/:id',
  [protect, authorize('admin')],
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  })
);

module.exports = router;
