const Patient = require('../models/Patients');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Medicine = require('../models/Medicine');
const Bed = require('../models/Bed');

// Aggregation: Appointments grouped by doctor with patient list
const appointmentsByDoctor = async (req, res) => {
  try {
    const result = await Appointment.aggregate([
      {
        $group: {
          _id: '$doctorName',
          count: { $sum: 1 },
          patients: { $addToSet: '$patientName' },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aggregation: Bed occupancy by ward
const bedOccupancy = async (req, res) => {
  try {
    const result = await Bed.aggregate([
      {
        $group: {
          _id: '$ward',
          total: { $sum: 1 },
          occupied: {
            $sum: { $cond: [{ $eq: ['$available', false] }, 1, 0] },
          },
          available: {
            $sum: { $cond: [{ $eq: ['$available', true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 1,
          total: 1,
          occupied: 1,
          available: 1,
          occupancyRate: { $multiply: [{ $divide: ['$occupied', '$total'] }, 100] },
        },
      },
      { $sort: { occupancyRate: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aggregation: Medicine stock levels
const medicineStock = async (req, res) => {
  try {
    const result = await Medicine.aggregate([
      {
        $project: {
          name: 1,
          stock: 1,
          price: 1,
          expiry: 1,
          stockLevel: {
            $cond: [
              { $lte: ['$stock', 10] },
              'Low',
              { $cond: [{ $lte: ['$stock', 25] }, 'Medium', 'High'] },
            ],
          },
        },
      },
      { $sort: { stock: 1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aggregation: Patients grouped by disease history
const patientsByDiseaseHistory = async (req, res) => {
  try {
    const result = await Patient.aggregate([
      { $unwind: '$diseaseHistory' },
      {
        $group: {
          _id: '$diseaseHistory',
          patientCount: { $sum: 1 },
          patients: { $addToSet: { name: '$name', age: '$age' } },
        },
      },
      { $sort: { patientCount: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aggregation: Doctor statistics (appointments handled, availability)
const doctorStats = async (req, res) => {
  try {
    const result = await Doctor.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'name',
          foreignField: 'doctorName',
          as: 'appointments',
        },
      },
      {
        $project: {
          name: 1,
          specialization: 1,
          available: 1,
          appointmentCount: { $size: '$appointments' },
          appointments: 1,
        },
      },
      { $sort: { appointmentCount: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aggregation: Appointment statistics (overall summary, optional date range)
const appointmentStats = async (req, res) => {
  try {
    const result = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          uniqueDoctors: { $addToSet: '$doctorName' },
          uniquePatients: { $addToSet: '$patientName' },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          doctorCount: { $size: '$uniqueDoctors' },
          patientCount: { $size: '$uniquePatients' },
          doctors: '$uniqueDoctors',
          patients: '$uniquePatients',
        },
      },
    ]);
    res.json(result.length > 0 ? result[0] : { total: 0, doctorCount: 0, patientCount: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  appointmentsByDoctor,
  bedOccupancy,
  medicineStock,
  patientsByDiseaseHistory,
  doctorStats,
  appointmentStats,
};
