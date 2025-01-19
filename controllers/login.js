const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id, userName: user.username}, process.env.JWT_SECRET_KEY);
}

exports.postUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ where: { email}});
        if (!user) {
            return res.status(404).json({ message: 'user not found!'});
        }
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Something went wrong!'});
                }
                if (result) {
                    res.status(200).json({ message: 'Use logged in successfully', token: generateAccessToken(user), userId: user.id});
                }
                else {
                    return res.status(401).json({ message: 'Password does not match!'});
                }
            })
        }
    }
    catch(error) {
        res.status(404).json({ message: 'User not found!'});
        console.log(error);
    }
}