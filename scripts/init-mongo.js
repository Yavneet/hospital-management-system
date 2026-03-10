// MongoDB initialization script
db = db.getSiblingDB('hospital_management');

// Create collections
db.createCollection('patients');
db.createCollection('doctors');
db.createCollection('appointments');
db.createCollection('medicines');
db.createCollection('beds');

// Create indexes
db.patients.createIndex({ "email": 1 }, { unique: true });
db.doctors.createIndex({ "email": 1 }, { unique: true });
db.appointments.createIndex({ "patientId": 1, "date": 1 });
db.appointments.createIndex({ "doctorId": 1, "date": 1 });

// Insert sample data if collections are empty
if (db.patients.countDocuments() === 0) {
  print("Inserting sample patient data...");
  // Sample data will be inserted via the seed script
}

print("MongoDB initialization completed.");