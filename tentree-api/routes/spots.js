const express = require('express'); 
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
        },
        reviews: {
          include: {
            user: {
              select: {
                FirstName: true,
                LastName: true
              }
            }
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

//GET spot info (using spot ID)
router.get('/:id', async (req, res) => {
  const { id } = req.params;  // Get the spot ID from the route parameters
  
  try {
    const spot = await prisma.campingspot.findUnique({
      where: { ID: parseInt(id) },
      include: {
        city: {
          include: {
            country: true, // Include country details
          },
        },
        photos: true,  // Include photos for the spot
        camping_spot_amenities: {
          include: {
            amenities: true,  // Include amenities details
          } ,
        },
      
        reviews: true,  // Include reviews for the spot
      },
    });
    
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }
    res.json(spot);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch spot details' });
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
    amenities
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

router.put('/:spotId', authenticateToken, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const {
    Name,
    Description,
    Price,
    MaxGuests,
    Street,
    CityName,
    CountryID,
    amenities
  } = req.body;

  try {
    // 1. Ensure city exists or create it
    let city = await prisma.city.findFirst({
      where: { Name: CityName, Country_ID: CountryID }
    });

    if (!city) {
      city = await prisma.city.create({
        data: {
          Name: CityName,
          Country: { connect: { ID: CountryID } }
        }
      });
    }

    // 2. Update the camping spot
    const updatedSpot = await prisma.campingspot.update({
      where: { ID: spotId },
      data: {
        Name,
        Description,
        Price,
        MaxGuests,
        Street,
        City: city.ID  // ← assign foreign key directly
      }
    });

    // 3. Update amenities via the join table
    await prisma.camping_spot_amenities.deleteMany({
      where: { CampingSpot_ID: spotId }
    });

    if (Array.isArray(amenities) && amenities.length > 0) {
      const amenityData = amenities.map((id) => ({
        CampingSpot_ID: spotId,
        Amenity_ID: id
      }));

      await prisma.camping_spot_amenities.createMany({
        data: amenityData
      });
    }

    // 4. Return updated spot with relations (optional)
    const fullSpot = await prisma.campingspot.findUnique({
      where: { ID: spotId },
      include: {
        city: { include: { country: true } },
        camping_spot_amenities: {
          include: {
            amenities: true
          }
        }
      }
    });

    res.json({ message: 'Spot updated successfully', spot: fullSpot });

  } catch (error) {
    console.error('Error updating spot:', error);
    res.status(500).json({ error: 'Failed to update spot' });
  }
});


module.exports = router;