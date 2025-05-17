const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const automationService = require('../services/automation.service');

/**
 * Get all tasks for a project
 * @route GET /api/projects/:projectId/tasks
 * @access Private (project members only)
 */
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const tasks = await Task.find({ projectId })
      .populate('assignee', 'name email profilePicture')
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get single task
 * @route GET /api/tasks/:id
 * @access Private (project members only)
 */
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email profilePicture')
      .populate('createdBy', 'name email');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if user is project member (done in middleware)
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create new task
 * @route POST /api/projects/:projectId/tasks
 * @access Private (project members only)
 */
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, dueDate, assignee } = req.body;
    
    // Get project to verify status is valid
    const project = await Project.findById(projectId);
    
    if (status && !project.statuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${project.statuses.join(', ')}`
      });
    }
    
    const task = await Task.create({
      projectId,
      title,
      description,
      status: status || project.statuses[0], // Default to first status
      dueDate,
      assignee,
      createdBy: req.user._id
    });
    
    // Populate related fields for response
    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email profilePicture')
      .populate('createdBy', 'name email');
    
    // Check for task creation automations
    if (assignee) {
      await automationService.processTaskAssigned(task, null, assignee);
    }
    
    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update task
 * @route PUT /api/tasks/:id
 * @access Private (project members only)
 */
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assignee } = req.body;
    
    // Get task
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Get project to verify status is valid
    const project = await Project.findById(task.projectId);
    
    if (status && !project.statuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${project.statuses.join(', ')}`
      });
    }
    
    // Store old values for automation triggers
    const oldStatus = task.status;
    const oldAssignee = task.assignee;
    
    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        dueDate: dueDate !== undefined ? dueDate : task.dueDate,
        assignee: assignee !== undefined ? assignee : task.assignee
      },
      { new: true, runValidators: true }
    )
    .populate('assignee', 'name email profilePicture')
    .populate('createdBy', 'name email');
    
    // Check for automations based on updates
    
    // Status change automation
    if (status && status !== oldStatus) {
      await automationService.processStatusChange(updatedTask, oldStatus, status);
    }
    
    // Assignee change automation
    if (assignee !== undefined && String(assignee) !== String(oldAssignee)) {
      await automationService.processTaskAssigned(updatedTask, oldAssignee, assignee);
    }
    
    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete task
 * @route DELETE /api/tasks/:id
 * @access Private (project members only)
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};