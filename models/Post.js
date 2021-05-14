const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const {Schema} = require("mongoose");

mongoose.plugin(slug);

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    slug: {
        type: String,
        slug: "title",
        slug_padding_size: 4,
        unique: true
    },
    body: {
        type: String,
        require: true,
        minlength: 100,
    },
    image: {
        type: String,
        required: false
    },
    tags: {
        type: String,
        required: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: {
        type: Number,
        required: false,
        default: 0
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    picture: {
        type: String,
        required: false,
    }

}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
