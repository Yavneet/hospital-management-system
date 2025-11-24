const Medicine = require('../models/Medicine');

const getAllMedicines = async (req, res) => {
  try {
    const meds = await Medicine.find({}).lean();
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMedicine = async (req, res) => {
  try {
    const m = new Medicine(req.body);
    const saved = await m.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medicine.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Medicine not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllMedicines, addMedicine, deleteMedicine, updateMedicine };
