const express = require('express');
const projectController = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');
const automationController = require('../controllers/automation.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// Project routes
router.get('/', projectController.getUserProjects);
router.post('/', projectController.createProject);
router.get('/:projectId', authMiddleware.isProjectMember, projectController.getProject);
router.put('/:projectId', authMiddleware.isProjectOwner, projectController.updateProject);
router.delete('/:projectId', authMiddleware.isProjectOwner, projectController.deleteProject);
router.post('/:projectId/invite', authMiddleware.isProjectOwner, projectController.inviteToProject);

// Task routes
router.get('/:projectId/tasks', authMiddleware.isProjectMember, taskController.getProjectTasks);
router.post('/:projectId/tasks', authMiddleware.isProjectMember, taskController.createTask);

// Automation routes
router.get('/:projectId/automations', authMiddleware.isProjectMember, automationController.getProjectAutomations);
router.post('/:projectId/automations', authMiddleware.isProjectOwner, automationController.createAutomation);

module.exports = router;