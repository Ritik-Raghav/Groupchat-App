const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chat = sequelize.define('chat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    chat: {
        type: Sequelize.TEXT,  // <-- Change from STRING to TEXT to store longer URLs
        allowNull: false
    },
    // dateTime: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //     defaultValue: Sequelize.NOW
    // }
});

module.exports = Chat;
