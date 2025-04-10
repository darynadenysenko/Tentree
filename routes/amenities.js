const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all amenities
router.get('/', async (req, res) => {
  try {
    const amenities = await prisma.amenities.findMany({
      orderBy: {
        Name: 'asc'
      }
    });
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

module.exports = router;
