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
router.post('/:spotId', authenticateToken, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const userId = req.user.id;
  const { Rating, Comment } = req.body;

  try {
    const newReview = await prisma.reviews.create({
      data: {
        CampingSpot_ID: spotId,
        User_ID: userId,
        Rating,
        Comment
      }
    });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});


// GET all reviews made by a specific user
router.get('/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
  
    try {
      const userReviews = await prisma.reviews.findMany({
        where: { User_ID: userId },
        include: {
          campingspot: {
            select: { Name: true }
          }
        },
        orderBy: {
          CreatedAt: 'desc'
        }
      });
  
      res.json(userReviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user reviews' });
    }
  });
  
module.exports = router;
