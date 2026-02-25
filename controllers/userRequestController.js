const UserRequest = require('../models/UserRequest');
const User = require('../models/User');

// @desc    Create a new user request
// @route   POST /api/user-requests
// @access  Private (Manager only)
const createRequest = async (req, res) => {
    try {
        const { action, role, name, email, password, targetUser } = req.body;

        // Basic validation depending on action
        if (action === 'Add' && (!name || !email || !password)) {
            return res.status(400).json({ message: 'Name, email, and password are required for Add action' });
        }
        if (action === 'Remove' && !targetUser) {
            return res.status(400).json({ message: 'Target user is required for Remove action' });
        }

        const newRequest = await UserRequest.create({
            manager: req.user._id,
            action,
            role,
            name,
            email,
            password,
            targetUser
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user requests (Manager gets own, Admin gets all)
// @route   GET /api/user-requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Manager') {
            query.manager = req.user._id;
        }

        const requests = await UserRequest.find(query)
            .populate('manager', 'name email')
            .populate('targetUser', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status and process action
// @route   PUT /api/user-requests/:id/status
// @access  Private (Admin only)
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await UserRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'Pending') {
            return res.status(400).json({ message: 'Request is already processed' });
        }

        request.status = status;

        // Process Add/Remove action if Approved
        if (status === 'Approved') {
            if (request.action === 'Add') {
                const userExists = await User.findOne({ email: request.email });
                if (userExists) {
                    request.status = 'Rejected';
                    await request.save();
                    return res.status(400).json({ message: 'User with this email already exists so Request was Rejected' });
                }

                await User.create({
                    name: request.name,
                    email: request.email,
                    password: request.password,
                    role: request.role || 'Employee'
                });
            } else if (request.action === 'Remove') {
                await User.findByIdAndDelete(request.targetUser);
            }
        }

        await request.save();

        // Return updated request with populated fields
        const updatedRequest = await UserRequest.findById(req.params.id)
            .populate('manager', 'name email')
            .populate('targetUser', 'name email');

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRequest,
    getRequests,
    updateRequestStatus
};
