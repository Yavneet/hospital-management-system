const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = require('./config/db');
connectDB();

app.get('/', (req, res) => res.send('Hospital Management Backend Running'));

// Routes
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/beds', require('./routes/bedRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// If running in production mode, serve the React build files
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
