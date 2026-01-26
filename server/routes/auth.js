const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            username,
            email: normalizedEmail,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json({ _id: savedUser._id, username: savedUser.username, email: savedUser.email });
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }  // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        // Create Token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.status(200).json({ token, user: { _id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
