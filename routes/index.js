const express = require('express');
const router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.cookies.token)
    res.send([{"name": "Salah"}]);
});

module.exports = router;
