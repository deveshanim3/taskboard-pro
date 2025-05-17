const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member'
    }
  }],
  statuses: {
    type: [String],
    default: ['To Do', 'In Progress', 'Done']
  }
}, { timestamps: true });

// Ensure owner is always a member too
projectSchema.pre('save', function(next) {
  // Check if the owner is already in members array
  const ownerExists = this.members.some(member => 
    member.userId.toString() === this.owner.toString()
  );
  
  // If not, add the owner to members with 'owner' role
  if (!ownerExists) {
    this.members.push({
      userId: this.owner,
      role: 'owner'
    });
  }
  
  next();
});

module.exports = mongoose.model('Project', projectSchema);