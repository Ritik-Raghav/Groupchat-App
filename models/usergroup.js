const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Usergroup = sequelize.define('usergroup', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  isadmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Usergroup;