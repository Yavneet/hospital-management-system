const Appointment = require('../models/Appointment');

const getAllAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({}).lean();
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const a = await Appointment.findById(req.params.id).lean();
    if (!a) return res.status(404).json({ message: 'Appointment not found' });
    res.json(a);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addAppointment = async (req, res) => {
  try {
    const a = new Appointment(req.body);
    const saved = await a.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllAppointments, getAppointmentById, addAppointment, updateAppointment, deleteAppointment };
