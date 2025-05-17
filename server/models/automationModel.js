const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  trigger: {
    type: {
      type: String,
      required: true,
      enum: ['task_status_change', 'task_assigned', 'due_date_passed']
    },
    condition: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  action: {
    type: {
      type: String,
      required: true,
      enum: ['assign_badge', 'change_status', 'send_notification']
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index for efficiently querying automations by project
automationSchema.index({ projectId: 1 });

module.exports = mongoose.model('Automation', automationSchema);