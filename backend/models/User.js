const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bodytype: {
        type: String,
        enum: ['pear', 'apple', 'hourglass', 'rectangle', 'inverted-triangle'],
        default: 'rectangle'
    },
    skintone: {
        type: String,
        enum: ['fair', 'light', 'tan', 'brown', 'dark'],
        default: 'light'
    },
    height: {
        type: String,
        default: 'unknown'
    },
    weight: {
        type: String,
        default: 'unknown'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'other', 'prefer not to say'],
        default: 'prefer not to say'
    },
    ethnicity: {
        type: String,
        default: 'unknown'
    },
    style: {
        type: String,
        default: 'Not set'
    },

    
    recommendations: [
        {
            prompt: { type: String, required: true },
            image_url: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
