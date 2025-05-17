const Project = require('../models/projectModel');
const User = require('../models/userModel');

/**
 * Get all projects for current user
 * @route GET /api/projects
 * @access Private
 */
exports.getUserProjects = async (req, res) => {
  try {
    // Find all projects where user is a member
    const projects = await Project.find({
      'members.userId': req.user._id
    }).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get single project by ID
 * @route GET /api/projects/:id
 * @access Private (project members only)
 */
exports.getProject = async (req, res) => {
  try {
    // Project is already attached to req by isProjectMember middleware
    const project = await Project.findById(req.project._id)
      .populate('owner', 'name email')
      .populate('members.userId', 'name email profilePicture');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create new project
 * @route POST /api/projects
 * @access Private
 */
exports.createProject = async (req, res) => {
  try {
    const { title, description, statuses } = req.body;

    // Validate title
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project title is required'
      });
    }

    // req.user should be set by your auth middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication failed'
      });
    }

    const projectData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      owner: req.user._id,
      members: [{ userId: req.user._id, role: 'owner' }],
      statuses: Array.isArray(statuses) && statuses.length > 0 ? statuses : ['To Do', 'In Progress', 'Done']
    };
    console.log('Incoming projectData:', projectData);

    const project = await Project.create(projectData);

    return res.status(201).json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Create project error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update project
 * @route PUT /api/projects/:id
 * @access Private (project owner only)
 */
exports.updateProject = async (req, res) => {
  try {
    const { title, description, statuses } = req.body;
    
    // Project is already attached to req by isProjectOwner middleware
    const updatedProject = await Project.findByIdAndUpdate(
      req.project._id,
      {
        title: title || req.project.title,
        description: description || req.project.description,
        statuses: statuses || req.project.statuses
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    
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
 * Delete project
 * @route DELETE /api/projects/:id
 * @access Private (project owner only)
 */
exports.deleteProject = async (req, res) => {
  try {
    // Project is already attached to req by isProjectOwner middleware
    await Project.findByIdAndDelete(req.project._id);
    
    // Note: We should also delete related tasks and automations in a production app
    // This would be a good place for a cascade delete or a transaction
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Invite user to project
 * @route POST /api/projects/:id/invite
 * @access Private (project owner only)
 */
exports.inviteToProject = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is already a member
    const isMember = req.project.members.some(member => 
      member.userId.toString() === user._id.toString()
    );
    
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }
    
    // Add user to project members
    req.project.members.push({
      userId: user._id,
      role: 'member'
    });
    
    await req.project.save();
    
    res.status(200).json({
      success: true,
      data: req.project
    });
  } catch (error) {
    console.error('Invite to project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};