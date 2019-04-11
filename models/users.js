const db = require('../models/db.js');
const sequelize = require('sequelize');

const users = db.define('users', {
    username: sequelize.STRING,
    password: sequelize.STRING
});
module.exports = users;