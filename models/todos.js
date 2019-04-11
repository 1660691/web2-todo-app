const db = require('./db.js');
const sequelize = require('sequelize');

const todos = db.define('todos', {
    userid: sequelize.STRING,
    task: sequelize.STRING,
    done: sequelize.BOOLEAN
});
module.exports = todos;