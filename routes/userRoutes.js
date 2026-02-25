const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, createUser, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('Admin', 'Manager'), getUsers)
    .post(protect, authorize('Admin'), createUser);

router.route('/:id')
    .delete(protect, authorize('Admin'), deleteUser)
    .put(protect, authorize('Admin'), updateUser);

module.exports = router;
