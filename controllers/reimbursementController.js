const Reimbursement = require('../models/Reimbursement');

// @desc    Submit a new reimbursement claim
// @route   POST /api/reimbursements
// @access  Private (Employee)
const createReimbursement = async (req, res) => {
    try {
        const { amount, category, description, receiptUrl } = req.body;

        const reimbursement = await Reimbursement.create({
            employee: req.user._id,
            amount,
            category,
            description,
            receiptUrl,
        });

        res.status(201).json(reimbursement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reimbursements (for Manager/Admin) or own (for Employee)
// @route   GET /api/reimbursements
// @access  Private
const getReimbursements = async (req, res) => {
    try {
        let reimbursements;
        if (req.user.role === 'Employee') {
            reimbursements = await Reimbursement.find({ employee: req.user._id }).populate('employee', 'name email').sort({ createdAt: -1 });
        } else {
            // Admin or Manager see all
            reimbursements = await Reimbursement.find({}).populate('employee', 'name email').sort({ createdAt: -1 });
        }
        res.json(reimbursements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update reimbursement status
// @route   PUT /api/reimbursements/:id/status
// @access  Private (Manager/Admin)
const updateReimbursementStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reimbursement = await Reimbursement.findById(req.params.id);

        if (reimbursement) {
            reimbursement.status = status;
            const updatedReimbursement = await reimbursement.save();
            res.json(updatedReimbursement);
        } else {
            res.status(404).json({ message: 'Reimbursement claim not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReimbursement,
    getReimbursements,
    updateReimbursementStatus,
};
