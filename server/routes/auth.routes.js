const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Get current user profile
router.get('/user', authMiddleware.authenticate, authController.getCurrentUser);

// Update user profile
router.put('/user', authMiddleware.authenticate, authController.updateUser);

module.exports = router;