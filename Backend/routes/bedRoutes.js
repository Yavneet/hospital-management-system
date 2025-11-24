const express = require('express');
const router = express.Router();
const { getAllBeds, addBed, deleteBed, updateBed } = require('../controllers/bedController');

router.get('/', getAllBeds);
router.post('/', addBed);
router.delete('/:id', deleteBed);
router.put('/:id', updateBed);

module.exports = router;
