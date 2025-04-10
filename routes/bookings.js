const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');

// POST a new booking
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const {
    CampingSpot_ID,
    StartDate,
    EndDate,
    Price
  } = req.body;

  try {
    const newBooking = await prisma.booking.create({
      data: {
        User_ID: userId,
        CampingSpot_ID,
        StartDate: new Date(StartDate),
        EndDate: new Date(EndDate),
        Price,
        Status_ID: 1 
      }
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET all bookings (optionally include spot + user)
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: { FirstName: true, LastName: true }
        },
        campingspot: {
          select: { Name: true }
        },
        status: true
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET all bookings by a specific user
router.get('/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const userBookings = await prisma.booking.findMany({
      where: { User_ID: userId },
      include: {
        campingspot: { select: { Name: true } },
        status: true
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });

    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
});

// Change status manually (e.g for owner or admin)
router.patch('/:id/status', async (req, res) => {
  const bookingId = parseInt(req.params.id);
  const { statusId } = req.body;

  try {
    const updated = await prisma.booking.update({
      where: { ID: bookingId },
      data: { Status_ID: statusId }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

module.exports = router;
