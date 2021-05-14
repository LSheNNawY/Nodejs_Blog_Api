const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
/**
 * register function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
    const body = req.body;
    const routePath = req.route.path;

    try {
        const user = new User(body)
        // generate a salt for hash
        const salt = await bcrypt.genSalt(10);
        // hashing password
        user.password = await bcrypt.hash(user.password, salt);
        // set avatar regarding to gender
        if (user.gender === 'Male') {
            user.avatar = 'male.jpg'
        } else {
            user.avatar = 'female.png'
        }
        const savesUser = await user.save();

        res.status(200).json(savesUser);
    } catch (err) {
        const handledErrors = errorsHandler(routePath, err);
        res.status(401).json(handledErrors);
    }
}

/**
 * login function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
    const {email, password} = req.body;
    const data = {};

    try {
        const user = await User.findOne({"email": email});
        if (!user) {
            return res.status(401).json({"error": "invalid credentials"})
        }
        bcrypt.compare(password, user.password, (err, matched) => {
            if (matched) {
                data.userId = user.id;
                data.firstName = user.firstName;
                data.lastName = user.lastName;
                data.email = user.email;
                data.avatar = user.avatar;
                data.created_at = user.email;

                const token = jwt.sign({email: user.email}, process.env.SECRET_KEY)
                const expirationTime = new Date(Date.now() + parseInt(process.env.JWT_EXPIRATION));

                res.cookie('token', token, {httpOnly: true, expires: expirationTime, sameSite: "lax", secure: true});
                res.cookie('user_id', user.id, {httpOnly: true, expires: expirationTime, sameSite: "lax", secure: true});
                res.cookie('username', `${user.firstName} ${user.lastName}`, {httpOnly: true, expires: expirationTime, sameSite: "lax", secure: true});
                res.cookie('avatar', user.avatar, {httpOnly: true, expires: expirationTime, sameSite: "lax", secure: true});
                return res.status(200).json({...data, token: token});
            }
            return res.status(401).json({"error": "invalid credentials"})
        })

    } catch (err) {
        res.status(401).json({"error": "Error log you in, try again"});
    }
}


/**
 * get user by email function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.cookies.user_id});
        const posts = await Post.find({owner: user});
        user.posts = posts;
        res.status(200).json(user);
    } catch (error) {
        res.status(401).send('Error getting user');
    }
}

/**
 * make follow function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const makeFollow = async (req, res) => {
    const body = req.body;
    try {
        const user = await User.findOne({_id: body.follower});
        if (body.type === 'follow') {
            if (user.followings.indexOf(body.followed) === -1) {
                user.followings.push(body.followed)
                user.save()
                    .then(() => res.status(200).json({ok: true}))
                    .catch(err => res.status(400).json({ok: false}))
            }
        } else {
            const index = user.followings.indexOf(body.followed);
            if (index !== -1) {
                user.followings.splice(index, 1);
                user.save()
                    .then(() => res.status(200).json({ok: true}))
                    .catch(err => res.status(400).json({ok: false}))
            }
        }
    } catch (error) {
        res.status(401).json('Error');
    }
}

/**
 * get all user function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

/**
 * error handler function
 * @param routePath
 * @param err
 * @returns {{}}
 */
const errorsHandler = (routePath, err) => {
    const validationErrors = {};

    if (routePath === '/register') {
        if (err.code === 11000) {
            validationErrors['email'] = 'Email already taken!';
            return validationErrors;
        }

        if (err.message.includes('User validation failed'))
            Object.values(err.errors).forEach(({properties}) => {
                validationErrors[properties.path] = properties.message;
            });
    }


    return validationErrors;
};

module.exports = {
    register,
    login,
    getUser,
    makeFollow,
}
