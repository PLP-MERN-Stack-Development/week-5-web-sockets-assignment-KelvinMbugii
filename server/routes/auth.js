const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const message = require('../models/message');


const router = express.Router();

//Register
router.post('/register', async(req, res) => {
    try{
        const { username, password } = req.body;
        const exists = await User.findOne({ username });
        if(exists) return res.status(400).json({message: 'User already exists'});

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashed });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.json({ token, username });
    }catch (err){
        res.status(500).json({ message: 'Server error'})
    }
});

// Login
router.post('/login', async (req, res) =>{
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ message: 'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if( !isMatch ) return res.status(400).json({ message: 'Invalid credentials'});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, username });
    }catch(err){
        res.status(500).json({ message: 'Server error'});
    }
});

module.exports = router;