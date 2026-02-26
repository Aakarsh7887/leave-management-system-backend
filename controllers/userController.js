const User = require("../models/User");

// @desc    Get all users (filtered by role optionally)
// @route   GET /api/users
// @access  Private (Admin, Manager)
const getUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await User.find(query).select("-password").sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === "Admin") {
        return res.status(400).json({ message: "Cannot delete admin user" });
      }
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user (Admin adding employee/manager)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (userRole === "Admin") {
      const adminCount = await User.countDocuments({ role: "Admin" });

      if (adminCount >= 3) {
        return res.status(400).json({
          message: "Maximum limit of 3 Admin users reached",
        });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "Employee",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role/details
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === "Admin" && req.body.role && req.body.role !== "Admin") {
        // Optionally prevent admin from downgrading themselves
        if (user._id.toString() === req.user._id.toString()) {
          return res.status(400).json({ message: "Cannot downgrade yourself" });
        }
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
};
