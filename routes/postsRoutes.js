const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/PostsController')
const UsersController = require('../controllers/UsersController')
const jwtAuth = require('../helpers/authMiddleware')


/* GET User Profile Data */
router.get('/posts', async (req, res) => {
    await PostsController.getPosts(req, res);
});

/* GET User's posts */
router.get('/myposts', async (req, res) => {
    await PostsController.getUsersPosts(req, res);
});

/* POST New Post */
router.post('/posts', async (req, res) => {
    await PostsController.createPost(req, res);
});

/* GET Post */
router.get('/posts/:slug', async (req, res) => {
    await PostsController.getPost(req, res);
});


/* GET followings' posts */
router.get('/followings', async (req, res) => {
    await PostsController.getFollowingsPosts(req, res);
});

/* PUT post */
router.put('/posts/:slug', async (req, res) => {
    await PostsController.updatePost(req, res);
});

/* DELETE post */
router.delete('/posts/:slug', async (req, res) => {
    await PostsController.deletePost(req, res);
});



module.exports = router;
