const User = require('../models/userModel');

/**
 * Get current user profile
 * @route GET /api/auth/user
 * @access Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/user
 * @access Private
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    
    // Update only allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name: name || req.user.name,
        profilePicture: profilePicture || req.user.profilePicture
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};