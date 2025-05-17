const Automation = require('../models/automationModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

/**
 * Process all automation rules for a status change event
 * @param {Object} task - The updated task
 * @param {String} oldStatus - The previous status
 * @param {String} newStatus - The new status
 */
exports.processStatusChange = async (task, oldStatus, newStatus) => {
  try {
    // Find all active automations for this project with task_status_change trigger
    const automations = await Automation.find({
      projectId: task.projectId,
      'trigger.type': 'task_status_change',
      isActive: true
    });
    
    // Process each automation
    for (const automation of automations) {
      const condition = automation.trigger.condition || {};
      
      // Check if the automation condition matches the status change
      if (condition.newStatus === newStatus || 
         (condition.oldStatus === oldStatus && condition.newStatus === newStatus) ||
         (!condition.oldStatus && !condition.newStatus)) {
        
        // Execute the action
        await executeAutomationAction(automation, task);
      }
    }
  } catch (error) {
    console.error('Process status change automation error:', error);
  }
};

/**
 * Process all automation rules for a task assignment event
 * @param {Object} task - The updated task
 * @param {ObjectId} oldAssignee - The previous assignee (may be null)
 * @param {ObjectId} newAssignee - The new assignee (may be null)
 */
exports.processTaskAssigned = async (task, oldAssignee, newAssignee) => {
  try {
    // Find all active automations for this project with task_assigned trigger
    const automations = await Automation.find({
      projectId: task.projectId,
      'trigger.type': 'task_assigned',
      isActive: true
    });
    
    // Process each automation
    for (const automation of automations) {
      const condition = automation.trigger.condition || {};
      
      // Check if the automation condition matches the assignment change
      if (!condition.userId || condition.userId.toString() === newAssignee.toString()) {
        // Execute the action
        await executeAutomationAction(automation, task);
      }
    }
  } catch (error) {
    console.error('Process task assigned automation error:', error);
  }
};

/**
 * Process all automation rules for a due date passed event
 * @param {Object} task - The task with a passed due date
 */
exports.processDueDatePassed = async (task) => {
  try {
    // Find all active automations for this project with due_date_passed trigger
    const automations = await Automation.find({
      projectId: task.projectId,
      'trigger.type': 'due_date_passed',
      isActive: true
    });
    
    // Process each automation
    for (const automation of automations) {
      // Execute the action
      await executeAutomationAction(automation, task);
    }
  } catch (error) {
    console.error('Process due date passed automation error:', error);
  }
};

/**
 * Execute the action part of an automation rule
 * @param {Object} automation - The automation rule
 * @param {Object} task - The task object
 */
async function executeAutomationAction(automation, task) {
  try {
    const actionType = automation.action.type;
    const actionData = automation.action.data || {};
    
    switch (actionType) {
      case 'assign_badge':
        await assignBadge(task, actionData);
        break;
        
      case 'change_status':
        await changeTaskStatus(task, actionData);
        break;
        
      case 'send_notification':
        await sendNotification(task, actionData);
        break;
        
      default:
        console.warn(`Unknown action type: ${actionType}`);
    }
  } catch (error) {
    console.error('Execute automation action error:', error);
  }
}

/**
 * Action handler: Assign a badge to a user
 * @param {Object} task - The task object
 * @param {Object} actionData - The action data object
 */
async function assignBadge(task, actionData) {
  // Since we don't have a badge system in our core functionality,
  // this is where you would implement that logic
  console.log(`Badge '${actionData.badgeType}' would be assigned for task: ${task._id}`);
  
  // For demonstration purposes only:
  if (task.assignee) {
    console.log(`Badge would be assigned to user: ${task.assignee}`);
  }
}

/**
 * Action handler: Change a task's status
 * @param {Object} task - The task object
 * @param {Object} actionData - The action data object
 */
async function changeTaskStatus(task, actionData) {
  try {
    if (actionData.newStatus) {
      await Task.findByIdAndUpdate(task._id, {
        status: actionData.newStatus
      });
      
      console.log(`Task ${task._id} status changed to ${actionData.newStatus}`);
    }
  } catch (error) {
    console.error('Change task status error:', error);
  }
}

/**
 * Action handler: Send a notification
 * @param {Object} task - The task object
 * @param {Object} actionData - The action data object
 */
async function sendNotification(task, actionData) {
  // Since we don't have a notification system in our core functionality,
  // this is where you would implement that logic
  const message = actionData.message || 'Task notification';
  const recipient = actionData.recipientId || (task.assignee ? task.assignee : null);
  
  console.log(`Notification '${message}' would be sent for task: ${task._id}`);
  
  if (recipient) {
    console.log(`Notification would be sent to user: ${recipient}`);
  }
}