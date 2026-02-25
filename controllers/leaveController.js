const LeaveRequest = require('../models/LeaveRequest');

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private (Employee)
const createLeaveRequest = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;

        const leaveRequest = await LeaveRequest.create({
            employee: req.user._id,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all leave requests (for Manager/Admin) or own (for Employee)
// @route   GET /api/leaves
// @access  Private
const getLeaveRequests = async (req, res) => {
    try {
        let leaves;
        if (req.user.role === 'Employee') {
            leaves = await LeaveRequest.find({ employee: req.user._id }).populate('employee', 'name email').sort({ createdAt: -1 });
        } else {
            // Admin or Manager see all
            leaves = await LeaveRequest.find({}).populate('employee', 'name email').sort({ createdAt: -1 });
        }
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update leave request status
// @route   PUT /api/leaves/:id/status
// @access  Private (Manager/Admin)
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leave = await LeaveRequest.findById(req.params.id);

        if (leave) {
            leave.status = status;
            const updatedLeave = await leave.save();
            res.json(updatedLeave);
        } else {
            res.status(404).json({ message: 'Leave request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createLeaveRequest,
    getLeaveRequests,
    updateLeaveStatus,
};
