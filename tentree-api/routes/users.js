const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('./authLogic');

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

      res.status(201).json(newUser);  
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

module.exports = router;