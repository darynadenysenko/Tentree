const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');

// Create a new booking

router.post('/', async (req, res) => {
  const { userId, campingSpotId, startDate, endDate, price } = req.body;  //get data from request body

  try { //try to create a new booking
    const booking = await prisma.booking.create({
      data: {
        User_ID: userId,
        CampingSpot_ID: Number(campingSpotId),
        StartDate: new Date(startDate),
        EndDate: new Date(endDate),
        Price: parseFloat(price), 
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
    await Promise.all( //wait for all updates to complete (promise.all run all promises in parallel)
      dates.map(async d => { //loop through each date, apply funciton
        await prisma.availability.updateMany({
          where: {
            CampingSpot_ID: Number(campingSpotId),
            Date: {
              gte: new Date(d.toISOString().split('T')[0]), // >= start of the day
              lt: new Date(new Date(d).setDate(d.getDate() + 1)) // < next day
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


// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,         // Include user info 
        campingspot: true,  // Include camping spot info 
        status: true,       // Include booking status info 
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
        campingspot: {
          include: {
            reviews: true,
          }
        } ,
        review: true,
        status: true
      },
      orderBy: {
        StartDate: 'desc'
      }
    });

    res.json(userBookings);
  } catch (error) {
    console.error('Test Error:', error);
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
});


// GET a specific booking by ID
router.get('/:id', async (req, res) => {
  const bookingId = parseInt(req.params.id);

  if (isNaN(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { ID: bookingId }, 
      include: {
        campingspot: true, // Include the camping spot details!
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


// GET incoming bookings for a specific user (bookings for spots they own)
router.get('/incoming/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    // Fetch bookings for spots owned by this user
    const bookings = await prisma.booking.findMany({
      where: {
        campingspot: {
          Owner_ID: userId
        }
      },
      include: {
        user: {
          select: {
            FirstName: true,
            LastName: true,
            Email: true
          }
        },
        campingspot: {
          select: {
            Name: true
          }
        },
        status: {
          select: {
            Name: true
          }
        }
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching incoming bookings:', error);
    res.status(500).json({ error: 'Failed to fetch incoming bookings.' });
  }
});


// Update booking status (confirm or reject)
router.put('/:bookingId/status', authenticateToken, async (req, res) => {
  const bookingId = parseInt(req.params.bookingId, 10);
  const { statusName } = req.body;

  if (!['Confirmed', 'Rejected'].includes(statusName)) {
    return res.status(400).json({ error: 'Invalid status name' });
  }

  try {
    // Get the status ID by name
    const status = await prisma.status.findFirst({
      where: { Name: statusName }
    });

    if (!status) {
      return res.status(400).json({ error: 'Status not found' });
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { ID: bookingId },
      data: {
        Status_ID: status.ID
      }
    });

    res.json(updatedBooking);
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});


module.exports = router;
