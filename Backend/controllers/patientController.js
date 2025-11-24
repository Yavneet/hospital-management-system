const Patient = require('../models/Patients');

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).lean();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const p = await Patient.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: 'Patient not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addPatient = async (req, res) => {
  try {
    const p = new Patient(req.body);
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Patient not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Patient not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllPatients, getPatientById, addPatient, updatePatient, deletePatient };
