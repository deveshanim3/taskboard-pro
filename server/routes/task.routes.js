const express = require('express');
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// Task routes
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;