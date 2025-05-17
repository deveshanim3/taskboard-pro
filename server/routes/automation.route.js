const express = require('express');
const automationController = require('../controllers/automation.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// Automation routes
router.get('/:id', automationController.getAutomation);
router.put('/:id', authMiddleware.isProjectOwner, automationController.updateAutomation);
router.delete('/:id', authMiddleware.isProjectOwner, automationController.deleteAutomation);

module.exports = router;