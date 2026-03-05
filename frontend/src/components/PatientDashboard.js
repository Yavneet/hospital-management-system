import React, { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [beds, setBeds] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [newAppt, setNewAppt] = useState({ doctorName: '', date: '', reason: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const patientName = localStorage.getItem('name') || 'Guest Patient';

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appts, docs, bds, meds] = await Promise.all([
        apiFetch('/api/appointments'),
        apiFetch('/api/doctors'),
        apiFetch('/api/beds'),
        apiFetch('/api/medicines'),
      ]);
      const myAppts = Array.isArray(appts) ? appts.filter(a => (a.patientName || a.patient?.name || '').includes(patientName)) : [];
      setAppointments(myAppts);
      setDoctors(Array.isArray(docs) ? docs : []);
      setBeds(Array.isArray(bds) ? bds : []);
      setMedicines(Array.isArray(meds) ? meds : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [patientName]);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function createAppointment(e) {
  
    try {
      const payload = { patientName, doctorName: newAppt.doctorName, date: newAppt.date, reason: newAppt.reason };
      await apiFetch('/api/appointments', { method: 'POST', body: JSON.stringify(payload) });
      setNewAppt({ doctorName: '', date: '', reason: '' });
      loadAll();
    } catch (err) {
      console.error(err);
      alert('Create failed');
    }
  }

  async function cancelAppointment(id) {
    if (!window.confirm('Cancel appointment?')) return;
    try {
      await apiFetch(`/api/appointments/${id}`, { method: 'DELETE' });
      loadAll();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  async function purchaseMedicine(id) {
    const qty = parseInt(prompt('Quantity to purchase:'), 10);
    if (!qty || qty <= 0) return;
    try {
      await apiFetch(`/api/medicines/${id}/purchase`, { method: 'POST', body: JSON.stringify({ quantity: qty }) });
      loadAll();
    } catch (err) {
      console.error(err);
      alert('Purchase failed');
    }
  }

  async function bookBed(id) {
    if (!window.confirm('Book bed?')) return;
    try {
      await apiFetch(`/api/beds/${id}`, { method: 'PUT', body: JSON.stringify({ available: false }) });
      loadAll();
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  }

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <p>Welcome, <strong>{patientName}</strong></p>

      {loading ? <p>Loading…</p> : error ? <div className="alert alert-danger">{error}</div> : (
        <div>
          <section className="mb-4">
            <h4>My Appointments</h4>
            <form onSubmit={createAppointment} className="row g-2 mb-3">
              <div className="col-md-4">
                <select className="form-select" required value={newAppt.doctorName} onChange={e => setNewAppt({ ...newAppt, doctorName: e.target.value })}>
                  <option value="">Choose doctor</option>
                  {doctors.map(d => <option key={d._id} value={d.name}>{d.name} ({d.specialty || d.specialization || ''})</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <input className="form-control" type="datetime-local" required value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} />
              </div>
              <div className="col-md-3">
                <input className="form-control" placeholder="Reason" value={newAppt.reason} onChange={e => setNewAppt({ ...newAppt, reason: e.target.value })} required />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary">Book</button>
              </div>
            </form>

            {appointments.length === 0 ? <p>No appointments yet.</p> : (
              <div className="list-group">
                {appointments.map(a => (
                  <div key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div><strong>Doctor:</strong> {a.doctorName || a.doctor?.name}</div>
                      <div><strong>Date:</strong> {new Date(a.date).toLocaleString()}</div>
                      <div><strong>Reason:</strong> {a.reason || '—'}</div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-danger" onClick={() => cancelAppointment(a._id)}>Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-4">
            <h4>Beds</h4>
            <div className="row">
              {beds.map(b => (
                <div className="col-md-4" key={b._id}>
                  <div className="card mb-2">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <div><strong>Ward:</strong> {b.ward || b.type}</div>
                        <div><strong>Number:</strong> {b.number || b.bedNumber}</div>
                        <div><strong>Available:</strong> {b.available ? 'Yes' : 'No'}</div>
                      </div>
                      <div>
                        {b.available ? <button className="btn btn-sm btn-primary" onClick={() => bookBed(b._id)}>Book</button> : <span className="text-muted">Unavailable</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4>Medicines</h4>
            <div className="row">
              {medicines.map(m => (
                <div className="col-md-4" key={m._id}>
                  <div className="card mb-2">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <div><strong>{m.name}</strong></div>
                        <div>Stock: {m.stock}</div>
                        <div>Price: {m.price}</div>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-success" onClick={() => purchaseMedicine(m._id)} disabled={m.stock <= 0}>Purchase</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
