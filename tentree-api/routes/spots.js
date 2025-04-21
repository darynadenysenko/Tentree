const express = require('express');
const multer = require('../uploads'); 
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');

// GET all spots 
router.get('/spots', async function(req, res, next) {
  const data = await prisma.campingspot.findMany();
  res.json(data);
});

// GET all spots with search and sorting options
router.get('/filterspots', async (req, res) => {
  const { countryId, priceSortOrder, searchQuery } = req.query;
  
  let query = {
    where: {},
    include: {
      city: {
        include: {
          country: true,
        }
      }
    }
  };

  if (countryId) {
    query.where.city = {
      country: {
        ID: parseInt(countryId),
      }
      
    };
  }

  if (searchQuery) {
    query.where.Name = {
      contains: searchQuery,
    };
  }

  // Sorting by price
  if (priceSortOrder) {
    query.orderBy = {
      Price: priceSortOrder === 'asc' ? 'asc' : 'desc',
    };
  }
  
  try {
    const spots = await prisma.campingspot.findMany(query);
    res.json(spots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch spots' });
  }
});


// GET all spots from specific user
router.get('/myspots', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const spots = await prisma.campingspot.findMany({
      where: {Owner_ID: userId},
      include:{
        photos: {take : 1},
        city:{
          include:{
            country: true
          } 
        }
      }
    });
    res.status(200).json(spots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch spots' });
  }
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
    CountryID,
    Amenities
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

    // Create the camping spot 
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

    if (amenities && amenities.length > 0) {
      const amenityConnections = amenities.map(amenityId => ({
        CampingSpot_ID: newSpot.ID,
        Amenity_ID: amenityId
      }));

      await prisma.camping_spot_amenities.createMany({
        data: amenityConnections
      });
    }

    res.status(201).json(newSpot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create camping spot' });
  }
});




module.exports = router;