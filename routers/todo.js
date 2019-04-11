const Router = require('express-promise-router');
const router = Router();

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const sequelize = require('sequelize');
const db = require('../models/db.js')
const users = require('../models/users.js');
const todos = require('../models/todos.js');

router.get('/', async function (req, res) {
    if (typeof (req.session.username) !== 'undefined') {
        const session_username = req.session.username;

        let userTodos = null;
        await users.findOne(
            { where: { username: session_username } }
        ).then(async (user) => {
            const _userid = user.dataValues.id + '';
            userTodos = await todos.findAll(
                { where: { userid: _userid } }
            );
        });
        
        userTodos.sort((a, b) => {
            return a.dataValues.id - b.dataValues.id;
        });

        const alert = req.query.alert;

        return res.render('todo', { session_username, userTodos, alert });
    }
    return res.redirect('../?alert=Please log in your account!');
});

router.post('/', async function (req, res) {
    res.send('nothing');
});

router.post('/add', urlEncodedParser, async function (req, res) {
    let { inputNote } = req.body;

    const user = await users.findOne(
        { where: { username: req.session.username } }
    );

    const _userid = user.dataValues.id;

    if (inputNote) {
        await todos.create({ userid: _userid, task: inputNote, done: false });
        return res.redirect('../?alert=Added note successfully!');
    }
    return res.redirect('../?alert=Invalid note! Please try again.');
});

router.post('/done', urlEncodedParser, async function (req, res) {
    const noteId = req.query.id;
    if (noteId) {
        await todos.update(
            { done: true },
            { where: { id: noteId } }
        );
    }
    return res.redirect('../?alert=To-do was done successfully!');
});

module.exports = router;