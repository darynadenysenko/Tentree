const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');

// GET all available dates for a specific camping spot
router.get('/:spotId', async (req, res) => {
  const spotId = parseInt(req.params.spotId);

  try {
    const availability = await prisma.availability.findMany({
      where: {
        CampingSpot_ID: spotId,
        IsAvailable: true
      },
      orderBy: {
        Date: 'asc'
      }
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Set a specific date available or unavailable for a camping spot 
router.patch('/:spotId', authenticateToken, async (req, res) => {
    const spotId = parseInt(req.params.spotId);
    const { date, isAvailable } = req.body;
  
    if (!date || typeof isAvailable !== 'boolean') {
      return res.status(400).json({ error: 'Date and isAvailable are required' });
    }
  
    try {
      const existing = await prisma.availability.findFirst({
        where: {
          CampingSpot_ID: spotId,
          Date: new Date(date)
        }
      });
  
      let result;
  
      if (existing) {
        // Update existing entry
        result = await prisma.availability.update({
          where: { ID: existing.ID },
          data: { IsAvailable: isAvailable }
        });
      } else {
        // Create new entry
        result = await prisma.availability.create({
          data: {
            CampingSpot_ID: spotId,
            Date: new Date(date),
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
