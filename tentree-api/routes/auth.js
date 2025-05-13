const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('./authLogic');
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware

const bcrypt = require('bcrypt');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'darinadenisenko2204@gmail.com',
    pass: 'stcb gbma hcgf jggw'
  }
});


router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { Email: email }
    });

    // Always respond the same for security
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    // Save token
    await prisma.passwordresettoken.create({
      data: {
        User_ID: user.ID,
        Token: token,
        ExpiresAt: expiresAt
      }
    });

    // Email reset link
    const resetLink = `http://localhost:8080/resetpassword?token=${token}`; // adjust if needed


    await transporter.sendMail({
      to: user.Email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

    res.json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


router.post('/resetpassword', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetToken = await prisma.passwordresettoken.findUnique({
      where: { Token: token },
      include: { user: true }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (new Date() > resetToken.ExpiresAt) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { ID: resetToken.User_ID },
      data: { Password: hashedPassword }
    });

    await prisma.passwordresettoken.delete({
      where: { Token: token }
    });

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;

  try {
    const hashedPassword = await auth.hashPassword(Password);
    const user = await prisma.user.create({
      data: {
        FirstName,
        LastName,
        Email,
        Password: hashedPassword,
      },
    });
    res.status(201).json({ ID: user.ID, Email: user.Email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route (Authenticate user and generate token)
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { Email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify the password
    const isValid = await auth.verifyPassword(Password, user.Password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate the JWT token for the user
    const token = auth.generateToken(user); // Assuming `generateToken` is implemented in your `authLogic.js`

    // Respond with the token and user info
    res.json({
      token,
      user: {
        id: user.ID,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error.message });
  }
});

module.exports = router;
