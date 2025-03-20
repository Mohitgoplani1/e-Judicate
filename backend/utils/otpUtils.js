const nodemailer = require('nodemailer');

// Store OTPs temporarily
const otpStorage = {};

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ejudicate1@gmail.com",
    pass: "pjwlazjtzhrkepch"
  }
});

// Function to send OTP email
async function sendMail(email, otp) {
  try {
    await transporter.sendMail({
      to: email,
      subject: "OTP for Login - e-Judicate",
      html: `<p>Your OTP for login is: <b>${otp}</b></p>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { otpStorage, generateOTP, sendMail };
