const express = require('express');
const router = express.Router();
const {
  appointmentsByDoctor,
  bedOccupancy,
  medicineStock,
  patientsByDiseaseHistory,
  doctorStats,
  appointmentStats,
} = require('../controllers/statsController');

router.get('/appointments-by-doctor', appointmentsByDoctor);
router.get('/bed-occupancy', bedOccupancy);
router.get('/medicine-stock', medicineStock);
router.get('/patients-by-disease', patientsByDiseaseHistory);
router.get('/doctor-stats', doctorStats);
router.get('/appointment-stats', appointmentStats);

module.exports = router;
