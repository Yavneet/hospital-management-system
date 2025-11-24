const express = require('express');
const router = express.Router();
const { getAllMedicines, addMedicine, deleteMedicine, updateMedicine } = require('../controllers/medicineController');

router.get('/', getAllMedicines);
router.post('/', addMedicine);
router.delete('/:id', deleteMedicine);
router.put('/:id', updateMedicine);

module.exports = router;
