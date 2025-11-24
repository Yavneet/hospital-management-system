const Patient = require('../models/Patients');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Medicine = require('../models/Medicine');
const Bed = require('../models/Bed');

async function seedData() {
  // Clear existing data (be careful in production)
  await Promise.all([
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
    Appointment.deleteMany({}),
    Medicine.deleteMany({}),
    Bed.deleteMany({}),
  ]);

  // Indian sample patient names
  const indianPatientNames = [
    'Aarav Sharma', 'Vivaan Kumar', 'Aditya Singh', 'Vihaan Patel', 'Arjun Gupta',
    'Saanvi Sharma', 'Ananya Gupta', 'Isha Patel', 'Prisha Reddy', 'Neha Rao'
  ];

  const patients = indianPatientNames.map((name, i) => ({
    name,
    age: 18 + (i % 60),
    gender: i % 2 === 0 ? 'Male' : 'Female',
    diseaseHistory: i % 3 === 0 ? ['diabetes'] : [],
  }));

  const doctors = [
    { name: 'Dr. Rajesh Khanna', specialization: 'Cardiology', available: true },
    { name: 'Dr. Meera Menon', specialization: 'Neurology', available: true },
    { name: 'Dr. Rakesh Reddy', specialization: 'Pediatrics', available: false },
    { name: 'Dr. Suman Rao', specialization: 'Orthopedics', available: true },
  ];

  const medicines = Array.from({ length: 6 }).map((_, i) => ({
    name: `Medicine ${i + 1}`,
    stock: 10 + i * 5,
    price: 5 + i * 2,
    expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * (i + 1)).toISOString(),
    alternatives: [],
  }));

  const beds = Array.from({ length: 8 }).map((_, i) => ({
    bedNumber: i + 1,
    ward: i % 2 === 0 ? 'General' : 'ICU',
    available: i % 3 !== 0,
  }));

  const createdPatients = await Patient.insertMany(patients);
  const createdDoctors = await Doctor.insertMany(doctors);
  const createdMeds = await Medicine.insertMany(medicines);
  const createdBeds = await Bed.insertMany(beds);

  const appointments = createdPatients.slice(0, 10).map((p, idx) => ({
    patientName: p.name,
    doctorName: createdDoctors[idx % createdDoctors.length].name,
    date: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const createdAppointments = await Appointment.insertMany(appointments);

  return {
    patients: createdPatients.length,
    doctors: createdDoctors.length,
    medicines: createdMeds.length,
    beds: createdBeds.length,
    appointments: createdAppointments.length,
  };
}

module.exports = seedData;
