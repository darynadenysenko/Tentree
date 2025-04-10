const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');

// GET all spots 
router.get('/', async function(req, res, next) {
  const data = await prisma.campingspot.findMany();
  res.json(data);
});

//POST
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const {
    Name,
    Description,
    Price,
    MaxGuests,
    Street,
    CityName,
    CountryID 
  } = req.body;

  try {
    //Check if city exists
    let city = await prisma.city.findFirst({
      where: {
        Name: CityName,
        Country_ID: CountryID
      }
    });

    // Create city if it doesn't exist
    if (!city) {
      city = await prisma.city.create({
        data: {
          Name: CityName,
          Country_ID: CountryID
        }
      });
    }

    // Create the camping spot linked to user and city
    const newSpot = await prisma.campingspot.create({
      data: {
        Name,
        Description,
        Price,
        MaxGuests,
        Street,
        City: city.ID,
        Owner_ID: userId
      }
    });

    res.status(201).json(newSpot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create camping spot' });
  }
});




module.exports = router;