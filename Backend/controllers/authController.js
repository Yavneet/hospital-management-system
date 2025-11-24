const crypto = require('crypto');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctor');

function signToken(payload) {
  const secret = process.env.APP_SECRET || 'dev-secret';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return `${Buffer.from(JSON.stringify(payload)).toString('base64')}.${hmac.digest('hex')}`;
}

const patientLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const user = await Patient.findOne({ name }).lean();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    // simple plain-text password check (demo)
    if (user.password && password !== user.password) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ sub: user._id, role: 'patient', name: user.name, iat: Date.now() });
    res.json({ token, role: 'patient', name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const user = await Doctor.findOne({ name }).lean();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.password && password !== user.password) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ sub: user._id, role: 'doctor', name: user.name, iat: Date.now() });
    res.json({ token, role: 'doctor', name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { patientLogin, doctorLogin };
