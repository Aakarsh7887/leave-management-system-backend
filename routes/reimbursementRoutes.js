const express = require('express');
const router = express.Router();
const { createReimbursement, getReimbursements, updateReimbursementStatus } = require('../controllers/reimbursementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Employee', 'Manager', 'Admin'), createReimbursement)
    .get(protect, getReimbursements);

router.route('/:id/status')
    .put(protect, authorize('Manager', 'Admin'), updateReimbursementStatus);

module.exports = router;
