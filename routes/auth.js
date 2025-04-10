const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('./authLogic');

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

// Login route
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try { 
    const user = await prisma.user.findUnique({ where: { Email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isValid = await auth.verifyPassword(Password, user.Password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = auth.generateToken(user); // pass full user
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
