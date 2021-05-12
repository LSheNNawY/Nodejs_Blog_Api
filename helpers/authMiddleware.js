const jwt = require('jsonwebtoken')

const jwtAuthenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log('No token found');
        return res.status(401).send({"error": "Unauthorized: No token"});
    } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).send({"error": "Unauthorized: Invalid token"});
            } else {
                const email = decoded.email
                next();
            }
        })
    }
}

module.exports = jwtAuthenticate
