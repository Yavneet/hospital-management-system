const Bed = require('../models/Bed');

const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find({}).lean();
   
    const mapped = beds.map((b) => ({
      _id: b._id,
      bedNumber: b.bedNumber,
      type: b.ward || b.type,
      isOccupied: b.available === undefined ? null : !b.available,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addBed = async (req, res) => {
  try {
    const b = new Bed(req.body);
    const saved = await b.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteBed = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bed.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Bed not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Bed.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Bed not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllBeds, addBed, deleteBed, updateBed };
