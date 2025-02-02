const express = require('express');
const userModel = require('../models/user.model.js')
const bcrypt = require('bcrypt');
const {generateToken} = require('../jwt.js')
const router = express.Router();
const {verifyToken} = require('../jwt.js')
const User = require('../models/user.model.js');

// register the New User
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Send all required fields" });
    }

    try {
        // Check if email already exists in the database
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered" });
        }

        // Generate salt and hash the password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({ error: "Error generating salt" });
            }

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: "Error hashing password" });
                }

                try {
                    // Save new user to database
                    const user = await userModel.create({
                        username,
                        email,
                        password: hash
                    });
                    const token = generateToken(email);
                    res.cookie("token" ,token);
                    return res.status(201).json({ message: "User registered successfully", user, token });
                } catch (error) {
                    return res.status(500).json({ error: "Error saving user to database" });
                }
            });
        });

    } catch (error) {
        return res.status(500).json({ error: "Database error" });
    }
});


// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ error: "Send all required fields" });
    }

    try {
        // Find user by email
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare provided password with stored hashed password
        bcrypt.compare(password, existingUser.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error comparing password" });
            }

            if (!result) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            // Generate JWT token
            const token = generateToken(email);

            // Set token in cookie (secure options recommended for production)
            res.cookie("token", token, { httpOnly: true, secure: false });

            return res.status(200).json({ msg: "You are logged in", token });
        });

    } catch (error) {
        return res.status(500).json({ error: "Database error" });
    }
});

// Logout user
router.post("/logout", (req, res) => {
    res.clearCookie("token"); // Specify the cookie name, e.g., "token"
    return res.status(200).json({
        message: "Logged out successfully"
    });
});

// get userdata
router.get('/info', verifyToken, async (req, res) => {
    try {
        // Assuming req.user is populated by the verifyToken middleware
        const userEmail = req.user.email;

        // Fetch user data from the database
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send user data as response
        res.status(200).json({
            id: user._id,
            name: user.username,
            email: user.email,
            // You can add more fields as necessary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;