const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/authMiddleware');


// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save uploaded files to the "uploads" directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Naming files with timestamp to avoid conflicts
    },
});


const upload = multer({ storage: storage });


// GET all photos for a specific spot
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    try {
      const photos = await prisma.photo.findMany({
        where: {
          CampingSpotID: parseInt(spotId),
        },
      });
  
      res.json(photos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

// 2. POST to upload a new photo for a specific spot
router.post('/upload/:spotId', upload.single('photo'), async (req, res, next) => {
    
  
    try {
        const spotId = parseInt(req.params.spotId);
        const file = req.file; // The uploaded file
        const photoUrl = 'http://localhost:3000/uploads/' + file.filename; // URL to access the uploaded file
        const newPhoto = await prisma.photo.create({
        data: {
          URL: photoUrl,  // You can store the file path or URL
          CampingSpotID: spotId,
        },
      });
  
      res.status(201).json(newPhoto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload photo' });
    }
});

// 3. DELETE a specific photo
router.delete('/:photoId', authenticateToken, async (req, res) => {
    const { photoId } = req.params;
  
    try {
      const deletedPhoto = await prisma.photo.delete({
        where: { ID: parseInt(photoId) },
      });
  
      res.status(200).json(deletedPhoto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete photo' });
    }
  });


module.exports = router;