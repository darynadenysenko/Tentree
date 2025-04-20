const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

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

// Route to get the logged-in user's information
router.get('/profile', authenticateToken, async (req, res) => {
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


// PATCH route to update user profile
router.patch('/profile', authenticateToken, async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const userId = req.user.id;

  try {
    const updatedData = {};

    // Conditionally update fields only if they are provided in the request body
    if (firstName) updatedData.FirstName = firstName;
    if (lastName) updatedData.LastName = lastName;
    if (email) updatedData.Email = email;

    // Update the user in the database with the fields provided
    const updatedUser = await prisma.user.update({
      where: { ID: userId },
      data: updatedData,  // Only update fields that were provided
    });

    res.json({
      firstName: updatedUser.FirstName,
      lastName: updatedUser.LastName,
      email: updatedUser.Email,
    });  // Respond with updated user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user info' });
  }
});


//update password
router.patch('/update-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { ID: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the current password
    const isValid = await bcrypt.compare(currentPassword, user.Password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatedUser = await prisma.user.update({
      where: { ID: userId },
      data: { Password: hashedNewPassword },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;