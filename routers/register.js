const Router = require('express-promise-router');
const router = Router();

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../models/db');
const sequelize = require('sequelize');
const users = require('../models/users');

router.get('/', function (req, res) {
    let username = req.session.username;
    if (typeof (username) !== 'undefined')
        return res.redirect('/todo');
    return res.redirect('./?alert=Please log in your account!');
});

router.post('/', urlEncodedParser, async function (req, res) {
    let { inputUsername, inputPassword, inputConfirmedPassword } = req.body;

    if(!inputUsername || !inputPassword || !inputConfirmedPassword)
        return res.redirect('./?alert1=Please complete all fields!');
    if(inputPassword !== inputConfirmedPassword)
        return res.redirect('./?alert1=Confirmed password does not match');

    let user = await users.findOne(
        { where: { username: inputUsername } }
    );

    if(user)
        return res.redirect('./?alert1=Your username was used !');
    
    const passwordHash = await bcrypt.hash(inputPassword, saltRounds).then(async function(hash){
        await users.create({username: inputUsername, password: hash});
    });
    return res.redirect('./?alert1=Registered successfully!');
});

module.exports = router;