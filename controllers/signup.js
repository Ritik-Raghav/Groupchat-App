const User = require('../models/user');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); // sequelize operators

exports.postUser = async (req, res, next) => {
    try {
        const {username, email, mobile, password} = req.body;

        // Validating required fields
        if (!username || !email || !mobile || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Checks if user already exists (by email or mobile)
        const  existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    {email: email},
                    {mobile: mobile}
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email or mobile'})
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            console.log(err);
            const newUser = await User.create({
                username: username,
                email: email,
                mobile: mobile,
                password: hash
            });
            console.log(newUser)
            res.status(201).json(newUser);
        });
    }
    catch(error) {
        res.status(403).json({ message: 'request failed with status code 403'});
        console.log(error);
    }
}