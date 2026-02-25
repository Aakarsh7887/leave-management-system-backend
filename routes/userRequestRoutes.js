const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/userRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Manager'), createRequest)
    .get(protect, getRequests);

router.route('/:id/status')
    .put(protect, authorize('Admin'), updateRequestStatus);

module.exports = router;
