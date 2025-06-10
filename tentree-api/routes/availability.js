const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');


// Get availability for a specific camping spot
router.get('/:campingSpotId', async (req, res) => {
  const { campingSpotId } = req.params;

  try {
    const availability = await prisma.availability.findMany({
      where: { CampingSpot_ID: Number(campingSpotId) },
    });

    res.json(availability); // send the availability as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});


// Set dates available or unavailable for a camping spot
router.put('/:spotId', authenticateToken, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const updates = req.body.updates;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: 'Updates must be a non-empty array' });
  }

  try {
    const results = [];

    for (const update of updates) {
      const parsedDate = new Date(update.Date);
      const isAvailable = update.IsAvailable;

      if (!update.Date || typeof isAvailable !== 'boolean' || isNaN(parsedDate.getTime())) {
        continue; // skip if the date is invalid or isAvailable is not a boolean
      }

      // Check if the availability for this date already exists
      const existing = await prisma.availability.findFirst({
        where: {
          CampingSpot_ID: spotId,
          Date: parsedDate
        }
      });

      let result;
      
      // If it exists, update it; otherwise, create a new entry
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

      results.push(result);
    }

    res.status(200).json({ updated: results.length, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});




module.exports = router;
