const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('./authLogic');
const authenticateToken = require('../middleware/authMiddleware');  // Import the middleware


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
