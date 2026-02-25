const mongoose = require('mongoose');

const userRequestSchema = new mongoose.Schema({
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['Add', 'Remove'],
        required: true
    },
    role: {
        type: String,
        enum: ['Employee', 'Manager'],
        default: 'Employee'
    },
    // For Add requests
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    // For Remove requests
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const UserRequest = mongoose.model('UserRequest', userRequestSchema);

module.exports = UserRequest;
