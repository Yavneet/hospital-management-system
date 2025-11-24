const Doctor = require('../models/Doctor');

const getAllDoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({}).lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const d = await Doctor.findById(req.params.id).lean();
    if (!d) return res.status(404).json({ message: 'Doctor not found' });
    res.json(d);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addDoctor = async (req, res) => {
  try {
    const d = new Doctor(req.body);
    const saved = await d.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Doctor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, addDoctor, updateDoctor, deleteDoctor };
