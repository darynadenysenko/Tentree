const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');

// GET all reviews for a specific camping spot
router.get('/:spotId', async (req, res) => {
  const spotId = parseInt(req.params.spotId);

  try {
    const reviews = await prisma.reviews.findMany({
      where: { CampingSpot_ID: spotId },
      include: {
        user: {
          select: { FirstName: true, LastName: true }
        }
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST a review for a spot
router.post('/', authenticateToken, async (req, res) => {
  const { userId, spotId, comment, rating, bookingId } = req.body;

  try {
    // Prevent duplicate review for the same booking
    const existingReview = await prisma.reviews.findUnique({
        where: {
          Booking_ID: parseInt(bookingId),
        }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You already reviewed this booking.' });
    }

    // Create new review
    const newReview = await prisma.reviews.create({
      data: {
        CampingSpot_ID: spotId,
        User_ID: userId,
        Booking_ID: parseInt(bookingId), 
        Rating: rating,
        Comment: comment
      }
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});



// GET all reviews made by a specific user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {   

    const reviews = await prisma.reviews.findMany({
      where: {
        User_ID: userId
      },
      include: {
        campingspot: true
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;
