// auth controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const auth = {};

auth.signup = async (req, res) => {
    const data = req.body;
    const user = await User.findOne({ email: data.email });
    if (user) {
        return res.status(400).json({
            message: 'User already exists with this email'
        });
    }
    try{
        const passwordHash = await bcrypt.hash(data.password, 10);
        const user = await new User({
            name: data.name,
            email: data.email,
            password: passwordHash
        }).save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).send({
            message: "User created successfully",
            data: {
                token,
                user_id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(400).send({
            message: "Error creating user",
            error
        })
    }
};

auth.signin = async (req, res) => {
    const data = req.body;
    const user = await User.findOne({ email: data.email });
    if (!user) {
        return res.status(400).json({
            message: 'Email does not exist'
        });
    }
    try {
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY);
        res.status(200).send({
            message: "User signed in successfully",
            data: {
                token,
                user_id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(400).send({
            message: "Error signing in",
            error
        })
    }
};

module.exports = auth;