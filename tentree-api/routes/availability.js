const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');


/*router.get('/:spotId', async (req, res) => {
  const spotId = parseInt(req.params.spotId); // Extract spotId from URL

  try {
    const availability = await prisma.availability.findMany({
      where: {
        CampingSpot_ID: spotId,
        IsAvailable: true,  // Only show available dates
      },
      select: {
        Date: true,  // Return only the Date
      },
    });

    const formattedAvailability = availability.map((item) => ({
      start: item.Date.toISOString().split('T')[0],  // Format as YYYY-MM-DD
      end: item.Date.toISOString().split('T')[0],    // Single date event, so end is same as start
    }));

    res.json(formattedAvailability);  // Send formatted availability data
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});*/
router.get('/:campingSpotId', async (req, res) => {
  const { campingSpotId } = req.params;

  try {
    const availability = await prisma.availability.findMany({
      where: { CampingSpot_ID: Number(campingSpotId) },
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});


// GET all available dates for a specific camping spot
/*router.get('/:spotId', async (req, res) => {
  const spotId = parseInt(req.params.spotId);

  try {
    const availability = await prisma.availability.findMany({
      where: {
        CampingSpot_ID: spotId,
        IsAvailable: true,  // Only show available dates
      },
      orderBy: {
        Date: 'asc'
      }
    });

    const formattedAvailability = availability.map((item) => ({
      date: item.Date.toISOString().split('T')[0],  // Format as YYYY-MM-DD
    }));

    res.json(formattedAvailability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});*/

// Set a specific date available or unavailable for a camping spot 
router.patch('/:spotId', authenticateToken, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const { date, isAvailable } = req.body;
  
  const parsedDate = new Date(date);

  if (!date || typeof isAvailable !== 'boolean' || isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: 'Valid date and isAvailable are required' });
  }

  try {
    const existing = await prisma.availability.findFirst({
      where: {
        CampingSpot_ID: spotId,
        Date: parsedDate
      }
    });

    let result;

    if (existing) {
      result = await prisma.availability.update({
        where: { ID: existing.ID },
        data: { IsAvailable: isAvailable }
      });
    } else {
      result = await prisma.availability.create({
        data: {
          CampingSpot_ID: spotId,
          Date: parsedDate,
          IsAvailable: isAvailable
        }
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});


module.exports = router;
