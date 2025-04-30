const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');

// POST a new booking
/*router.post('/', authenticateToken, async (req, res) => {
  const {
    User_ID,
    CampingSpot_ID,
    StartDate,
    EndDate,
    Price
  } = req.body;

  try {
    const newBooking = await prisma.booking.create({
      data: {
        User_ID: User_ID,
        CampingSpot_ID,
        StartDate: new Date(StartDate),
        EndDate: new Date(EndDate),
        Price: new Prisma.Decimal(Price),
        Status_ID: 1 
      }
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});*/



router.post('/', async (req, res) => {

  const { userId, campingSpotId, startDate, endDate, price } = req.body;
  

  try {
    const booking = await prisma.booking.create({
      data: {
        User_ID: userId,
        CampingSpot_ID: Number(campingSpotId),
        StartDate: new Date(startDate),
        EndDate: new Date(endDate),
        Price: parseFloat(price), // Ensure price is properly parsed
        Status_ID: 1,
      },
    });

    // Generate array of dates for marking availability
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1); 
    }

    // Update availability for each date
    await Promise.all(
      dates.map(async d => {
        await prisma.availability.updateMany({
          where: {
            CampingSpot_ID: Number(campingSpotId),
            Date: {
              gte: new Date(d.toISOString().split('T')[0]),
              lt: new Date(new Date(d).setDate(d.getDate() + 1)) // Next day
            }
          },
          data: {
            IsAvailable: false
          }
        });
      })
    );
    

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,         // Include user info if you want
        campingspot: true,  // Include camping spot info if you want
        status: true,       // Include booking status info if you want
      },
      orderBy: {
        CreatedAt: 'desc', // Newest first
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// GET all bookings by a specific user
router.get('/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const userBookings = await prisma.booking.findMany({
      where: { User_ID: userId },
      include: {

        campingspot: true ,
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

router.get('/:id', async (req, res) => {
  const bookingId = parseInt(req.params.id);

  if (isNaN(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { ID: bookingId }, // adjust to your booking primary key field if needed
      include: {
        campingspot: true, // ✅ Include the camping spot details!
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});


// Change status manually (e.g for owner or)
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
