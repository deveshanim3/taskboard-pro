const admin = require('../config/firebase');
const User = require('../models/userModel');
const Project = require('../models/projectModel'); // consistent import

/**
 * Middleware to verify Firebase ID token and attach user to request
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      // Create user in MongoDB using Firebase info
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email || 'Unnamed',
      });
    }

    req.user = user;
    console.log("✅ Middleware ran. Attached user:", user);
    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * Middleware to check if user is a member of the project
 */
const isProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is a member
    const isMember = project.members.some(
      (member) => member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not a member of this project',
      });
    }

    // Attach project to request for potential future use
    req.project = project;
    next();
  } catch (error) {
    console.error('Project member check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Middleware to check if user is the owner of the project
 */
const isProjectOwner = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is the owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not the owner of this project',
      });
    }

    // Attach project to request for potential future use
    req.project = project;
    next();
  } catch (error) {
    console.error('Project owner check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  authenticate,
  isProjectMember,
  isProjectOwner,
};
