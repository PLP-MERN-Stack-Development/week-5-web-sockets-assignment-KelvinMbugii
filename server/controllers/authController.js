const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try{
        const existing = await User.findOne({ username });
        if(existing) return res.status(400).json({ error:"User already exists"});

        const hashed =await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashed });
        await newUser.save();
        res.status(201).json({ message: "User registered" });
    } catch(err) {
        res.status(500).json({ error: "Server error"});
    }
};

exports.login = async (req, res) => {
    const{ username, password } = req.body;
    try{
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ error: "Invalid credentials"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({ error: "Invalid credentials"});

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: "1h"
        });

        res.json({ token, username: user.username });
    } catch(err) {
        res.status(500).json({ error: "Server error" });
    }
};