const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: 3,
        maxLength: 15
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
    email: {
        type: String,
        required: [true, "Last name is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "Password is required"],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: false
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    }],
    avatar: {
        type: String,
        required: false,
        default: ""
    }

}, {timestamps: {createdAt: 'created_at', updatedAt: false}});
const User = mongoose.model('User', userSchema);

module.exports = User;
