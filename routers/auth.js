require('dotenv').config()

const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const { response } = require('express');

// @route POST api/auth/register
// @desc register
// @access Public
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing user or password"
        })
    }
    try {
        // check có ai trùng user không
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Bad reqeset"
            })
        }
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            username,
            password: hashedPassword
        })
        await newUser.save();

        // reture token
        const accessToken = jwt.sign({
            userId: newUser._id
        }, process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: "register success", accessToken })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})
// router.get('/', (req, res) => res.send('USE ROUTER'))

// @route POST api/auth/login
// @desc login user
// @access Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing user or password"
        })
    }

    // 
    try {
        // check xem có user này không
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect user or password"
            })
        }
        // usser Found
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: "Incorrect user or password"
            })
        }
        // reture token
        const accessToken = jwt.sign({
            userId: user._id
        }, process.env.ACCESS_TOKEN_SECRET)
        res.json({ success: true, message: "login success", accessToken })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

router.get('/test', async (req, res) => {
    res.status(200).json({
        success: true,
        message: "test success"
    })
})
module.exports = router;