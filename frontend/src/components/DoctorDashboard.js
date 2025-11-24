import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

function SimpleCalendar({ items }) {
  // items: [{ date: ISO, title }]
  // build a simple map by day
  const byDay = {};
  items.forEach(it => {
    const d = new Date(it.date);
    const key = d.toISOString().slice(0,10);
    (byDay[key] = byDay[key] || []).push(it);
  });
  // render next 14 days
  const days = [];
  const start = new Date();
  for (let i = 0; i < 14; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    const key = cur.toISOString().slice(0,10);
    days.push({ key, date: cur, items: byDay[key] || [] });
  }
  return (
    <div className="row">
      {days.map(d => (
        <div className="col-md-3 mb-2" key={d.key}>
          <div className="card">
            <div className="card-body">
              <div className="fw-bold">{d.date.toLocaleDateString()}</div>
              {d.items.length === 0 ? <div className="text-muted small">No Appts</div> : (
                d.items.map((it, idx) => <div key={idx} className="small">{new Date(it.date).toLocaleTimeString()} — {it.patientName || it.patient?.name}</div>)
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const all = await apiFetch('/api/appointments');
      const doctorName = localStorage.getItem('name');
      const filtered = Array.isArray(all) ? all.filter(a => (a.doctorName || a.doctor?.name || '').includes(doctorName)) : [];
      setAppointments(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateDate(id) {
    const newDate = prompt('New date/time (ISO or local):');
    if (!newDate) return;
    try {
      await apiFetch(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify({ date: newDate }) });
      load();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete appointment?')) return;
    try {
      await apiFetch(`/api/appointments/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <p>Welcome, {localStorage.getItem('name')}</p>
      {loading ? <p>Loading…</p> : error ? <div className="alert alert-danger">{error}</div> : (
        <div>
          <h4>Upcoming (14 days)</h4>
          <SimpleCalendar items={appointments} />

          <hr />
          <h4 className="mt-3">Appointments list</h4>
          {appointments.length === 0 ? <p>No appointments for you.</p> : (
            <div className="list-group">
              {appointments.map(a => (
                <div key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div><strong>Patient:</strong> {a.patientName || a.patient?.name || '—'}</div>
                    <div><strong>Date:</strong> {new Date(a.date).toLocaleString()}</div>
                    <div><strong>Reason:</strong> {a.reason || '—'}</div>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => updateDate(a._id)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(a._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
