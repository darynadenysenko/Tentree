const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all spots 
router.get('/', async function(req, res, next) {
  const data = await prisma.campingspot.findMany();
  res.json(data);
});



module.exports = router;