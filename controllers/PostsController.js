const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs')
const mongoose = require("mongoose");

/**
 * register function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createPost = async (req, res) => {
    const post = req.body;
    post.owner = req.cookies.user_id

    if (post.image) {
        // to declare some path to store your converted image
        const imageName = Math.random() * 100000 + Date.now() + '.png'
        const path = './public/uploads/' + imageName
        const image = post.image;

        post.image = imageName;

        Post.create(post).then((data) => {
            // to convert base64 format into random filename
            const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            fs.writeFile(path, base64Data, {encoding: 'base64'}, () => {
            });

            return res.status(200).json(data)
        }).catch(err => {
            const handledErrors = errorsHandler(err);
            res.status(401).json(handledErrors);
        });

    } else {
        try {
            const newPost = await Post.create(post)
            res.status(200).json(newPost)
        } catch (err) {
            const handledErrors = errorsHandler(err);
            res.status(401).json(handledErrors);
        }
    }
}

/**
 * get posts function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getPosts = async (req, res) => {
    try {
        const postsPerPage = 4;
        const page = parseInt(req.query.page || '0');
        const totalPosts = await Post.countDocuments({});
        let posts = [];
        if (req.query.search) {
            let regex = new RegExp(req.query.search, 'i');
            posts = await Post.find({$or: [{title: regex}, {tags: regex}]})
                .populate('owner', ["_id", "firstName", "lastName", "email", "avatar"])
                .limit(postsPerPage)
                .skip(postsPerPage * page)
        } else {
            posts = await Post.find({})
                .populate('owner', ["_id", "firstName", "lastName", "email", "avatar"])
                .limit(postsPerPage)
                .skip(postsPerPage * page)

        }

        res.status(200).json({
            totalPages: Math.ceil(totalPosts / postsPerPage),
            posts
        });
    } catch (error) {
        res.status(401).send('Error getting posts');
    }
}

/**
 * get post by slug function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({slug: req.params.slug}).populate("owner");
        const user = await User.findOne({_id: req.cookies.user_id});
        const data = {user, post}
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json('Error getting post');
    }
}

/**
 * get user's posts function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({owner: req.cookies.user_id}).populate('owner');
        res.status(200).json(posts);
    } catch (error) {
        res.status(401).json('Error getting post');
    }
}

/**
 * get followings posts function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getFollowingsPosts = async (req, res) => {
    try {
        const userFollowings = await User.findOne({_id: req.cookies.user_id}).select('followings -_id');
        const postsIds = userFollowings.followings.map(id => mongoose.Types.ObjectId(id))
        const posts = await Post.find({owner: {$in: postsIds}}).populate('owner');

        res.status(200).json(posts);
    } catch (error) {
        res.status(401).json('Error getting post');
    }
}

/**
 * update post function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updatePost = async (req, res) => {
    const oldPost = await Post.findOne({_id: req.body.id});
    const oldImage = oldPost.image;

    const post = {
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        image: req.body.image,
        owner: req.cookies.user_id
    };

    if (post.image && post.image !== '') {
        // to declare some path to store your converted image
        const imageName = Math.random() * 100000 + Date.now() + '.png'
        const path = './public/uploads/' + imageName

        oldPost.title = post.title;
        oldPost.body = post.body;
        oldPost.tags = post.tags;
        oldPost.image = imageName;

        oldPost.save().then((data) => {
            const base64Data = post.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');

            fs.writeFile(path, base64Data, {encoding: 'base64'}, () => {
                fs.rm('./public/uploads/' + oldImage, () => {
                })
            });

            return res.status(200).json(data)
        }).catch(err => {
            console.log(err)
            const handledErrors = errorsHandler(err);
            res.status(401).json(handledErrors);
        });

    } else {
        try {
            const post = await Post.updateOne({_id: req.body.id}, req.body)
            res.status(200).json(post)
            console.log(post)
        } catch (err) {
            console.log(err)
            const handledErrors = errorsHandler(err);
            res.status(401).json(handledErrors);
        }
    }


}


/**
 * delete post function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const deletePost = async (req, res) => {
    const slug = req.params.slug;
    try {
        const post = await Post.deleteOne({slug});
        console.log(post);
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
    }
}

/**
 * error handler function
 * @param err
 * @returns {{}}
 */
const errorsHandler = (err) => {
    const validationErrors = {};

    if (err.message.includes('Post validation failed'))
        Object.values(err.errors).forEach(({properties}) => {
            validationErrors[properties.path] = properties.message;
        });

    return validationErrors;
};

module.exports = {
    createPost,
    getPosts,
    getUsersPosts: getUserPosts,
    getPost,
    getFollowingsPosts,
    updatePost,
    deletePost
}
