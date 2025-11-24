const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, addDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/', addDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
