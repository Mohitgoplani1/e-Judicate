const express = require('express');
const router = express.Router();
const { sendMail, generateOTP, otpStorage } = require('../utils/otpUtils');

// Route to send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    const otp = generateOTP();
    otpStorage[email] = otp; // Store OTP temporarily

    try {
        await sendMail(email, otp);
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    if (otpStorage[email] && otpStorage[email] === code) {
        delete otpStorage[email]; // Remove OTP after successful verification
        return res.json({ success: true, message: "OTP verified successfully" });
    } else {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
});

module.exports = router;
