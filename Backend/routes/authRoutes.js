const express = require('express');
const router = express.Router();
const { patientLogin, doctorLogin } = require('../controllers/authController');

router.post('/patient-login', patientLogin);
router.post('/doctor-login', doctorLogin);

module.exports = router;
