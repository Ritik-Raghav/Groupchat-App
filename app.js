require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const User = require('./models/user');
const Chat = require('./models/chat');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatRoutes = require('./routes/chat');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
``
app.use('/signup/', signupRoutes);
app.use('/login/', loginRoutes);
app.use('/chat', chatRoutes);


User.hasMany(Chat);
Chat.belongsTo(User);


sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    })