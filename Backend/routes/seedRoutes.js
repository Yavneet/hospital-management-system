const express = require('express');
const router = express.Router();
const { runSeed } = require('../controllers/seedController');

// GET /api/seed  -> seeds the database (development only)
router.get('/', runSeed);

module.exports = router;
