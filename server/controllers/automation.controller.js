const Automation = require('../models/automationModel');

/**
 * Get all automations for a project
 * @route GET /api/projects/:projectId/automations
 * @access Private (project members only)
 */
exports.getProjectAutomations = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const automations = await Automation.find({ projectId })
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      count: automations.length,
      data: automations
    });
  } catch (error) {
    console.error('Get automations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get single automation
 * @route GET /api/automations/:id
 * @access Private (project members only)
 */
exports.getAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!automation) {
      return res.status(404).json({
        success: false,
        message: 'Automation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: automation
    });
  } catch (error) {
    console.error('Get automation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create new automation
 * @route POST /api/projects/:projectId/automations
 * @access Private (project owner only)
 */
exports.createAutomation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, trigger, action } = req.body;
    
    // Validate trigger type
    if (!['task_status_change', 'task_assigned', 'due_date_passed'].includes(trigger.type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trigger type'
      });
    }
    
    // Validate action type
    if (!['assign_badge', 'change_status', 'send_notification'].includes(action.type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action type'
      });
    }
    
    const automation = await Automation.create({
      projectId,
      name,
      trigger,
      action,
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: automation
    });
  } catch (error) {
    console.error('Create automation error:', error);
    
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
 * Update automation
 * @route PUT /api/automations/:id
 * @access Private (project owner only)
 */
exports.updateAutomation = async (req, res) => {
  try {
    const { name, trigger, action, isActive } = req.body;
    
    const automation = await Automation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({
        success: false,
        message: 'Automation not found'
      });
    }
    
    // Validate trigger type if provided
    if (trigger && !['task_status_change', 'task_assigned', 'due_date_passed'].includes(trigger.type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trigger type'
      });
    }
    
    // Validate action type if provided
    if (action && !['assign_badge', 'change_status', 'send_notification'].includes(action.type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action type'
      });
    }
    
    const updatedAutomation = await Automation.findByIdAndUpdate(
      req.params.id,
      {
        name: name || automation.name,
        trigger: trigger || automation.trigger,
        action: action || automation.action,
        isActive: typeof isActive === 'boolean' ? isActive : automation.isActive
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedAutomation
    });
  } catch (error) {
    console.error('Update automation error:', error);
    
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
 * Delete automation
 * @route DELETE /api/automations/:id
 * @access Private (project owner only)
 */
exports.deleteAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({
        success: false,
        message: 'Automation not found'
      });
    }
    
    await Automation.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete automation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};