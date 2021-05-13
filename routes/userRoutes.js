const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController')
const jwtAuth = require('../helpers/authMiddleware')
/* POST Register. */
router.post('/register', async (req, res, next) => {
    await UsersController.register(req, res);
});

/* POST Login. */
router.post('/login', async (req, res, next) => {
    await UsersController.login(req, res);
});

/* GET User Profile Data */
router.get('/profile', jwtAuth, async (req, res) => {
    await UsersController.getUser(req, res);
});

/* GET User Logout */
router.post('/logout', jwtAuth, async (req, res) => {
    res.clearCookie('token')
    res.clearCookie('user_id')
    res.clearCookie('username')
    res.clearCookie('email')
    res.clearCookie('avatar')

    return res.status(200).json({"msg": "Logged out"})
});

/* POST follow */
router.put('/follow', async (req, res) => {
    await UsersController.makeFollow(req, res);
});


module.exports = router;
