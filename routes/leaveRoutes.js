const express = require('express');
const router = express.Router();
const { createLeaveRequest, getLeaveRequests, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Employee', 'Manager', 'Admin'), createLeaveRequest)
    .get(protect, getLeaveRequests);

router.route('/:id/status')
    .put(protect, authorize('Manager', 'Admin'), updateLeaveStatus);

module.exports = router;
