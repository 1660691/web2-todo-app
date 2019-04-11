const Router = require('express-promise-router');
const router = Router();

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const bcrypt = require('bcrypt');
const saltRounds = 10;
const sequelize = require('sequelize');
const users = require('../models/users.js');

router.get('/', function (req, res) {
    let username = req.session.username;
    if (typeof (username) !== 'undefined')
        return res.redirect('/todo');
    return res.redirect('./?alert=Please log in your account!');
});

router.post('/', urlEncodedParser, async function (req, res) {
    let { inputUsername, inputPassword } = req.body;

    let user = await users.findOne(
        { where: { username: inputUsername } }
    );
    if (user) {
        const match = await bcrypt.compare(inputPassword, user.dataValues.password);

        if (match) {
            req.session.username = inputUsername;
            return res.redirect('/todo');
        }
    }
    return res.redirect('./?alert=Your username or password is not correct!');
});

module.exports = router;