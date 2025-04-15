const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('./authLogic');
const authenticateToken = require('../middleware/authMiddleware');  

/* GET all users */
router.get('/', async function(req, res, next) {
  const data = await prisma.user.findMany();
  res.json(data);
});

//POST users

router.post('/', async (req, res, next) => {
  // Check if a user with the same email already exists
  const checkUser = await prisma.user.findMany({
    where: {
      Email: req.body.Email
    }
  });

  // If a user exists with the same email, return an error message
  if (checkUser.length > 0) {
    return res.json({
      message: "User with this email already exists"
    });
  } else {
    // If no user exists with the same email, create a new user
    try {
      // Hash the password before saving 
      const hashedPassword = await auth.hashPassword(req.body.Password);

      const newUser = await prisma.user.create({
        data: {          
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
          Email: req.body.Email,
          Password: hashedPassword,  
        }
      });
      const token = auth.generateToken(newUser); 
      res.status(201).json({
        token: token,
        user: {
          firstName: newUser.FirstName,
          lastName: newUser.LastName,
          email: newUser.Email,
        }
      });   
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

// Route to get the logged-in user's information
router.get('/home', authenticateToken, async (req, res) => {
  try {
    // Retrieve user info based on the ID from the JWT token
    const user = await prisma.user.findUnique({ where: { ID: req.user.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back user data (first name, last name, email)
    res.json({
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;