import React, { useEffect, useState } from 'react';

export default function StatsBoard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentsByDoctor, setAppointmentsByDoctor] = useState([]);
  const [bedOccupancy, setBedOccupancy] = useState([]);
  const [medicineStock, setMedicineStock] = useState([]);
  const [patientsByDisease, setPatientsByDisease] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const [aRes, bRes, mRes, pRes, dRes, apRes] = await Promise.all([
          fetch('http://localhost:5000/api/stats/appointments-by-doctor'),
          fetch('http://localhost:5000/api/stats/bed-occupancy'),
          fetch('http://localhost:5000/api/stats/medicine-stock'),
          fetch('http://localhost:5000/api/stats/patients-by-disease'),
          fetch('http://localhost:5000/api/stats/doctor-stats'),
          fetch('http://localhost:5000/api/stats/appointment-stats'),
        ]);

        if (!aRes.ok || !bRes.ok || !mRes.ok || !pRes.ok || !dRes.ok || !apRes.ok) {
          throw new Error('Failed to fetch one or more stats');
        }

        const a = await aRes.json();
        const b = await bRes.json();
        const m = await mRes.json();
        const p = await pRes.json();
        const d = await dRes.json();
        const ap = await apRes.json();

        if (cancelled) return;
        setAppointmentsByDoctor(a || []);
        setBedOccupancy(b || []);
        setMedicineStock(m || []);
        setPatientsByDisease(p || []);
        setDoctorStats(d || []);
        setAppointmentStats(ap || null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [aRes, bRes, mRes, pRes, dRes, apRes] = await Promise.all([
        fetch('http://localhost:5000/api/stats/appointments-by-doctor'),
        fetch('http://localhost:5000/api/stats/bed-occupancy'),
        fetch('http://localhost:5000/api/stats/medicine-stock'),
        fetch('http://localhost:5000/api/stats/patients-by-disease'),
        fetch('http://localhost:5000/api/stats/doctor-stats'),
        fetch('http://localhost:5000/api/stats/appointment-stats'),
      ]);

      if (!aRes.ok || !bRes.ok || !mRes.ok || !pRes.ok || !dRes.ok || !apRes.ok) {
        throw new Error('Failed to fetch one or more stats');
      }

      const a = await aRes.json();
      const b = await bRes.json();
      const m = await mRes.json();
      const p = await pRes.json();
      const d = await dRes.json();
      const ap = await apRes.json();

      setAppointmentsByDoctor(a || []);
      setBedOccupancy(b || []);
      setMedicineStock(m || []);
      setPatientsByDisease(p || []);
      setDoctorStats(d || []);
      setAppointmentStats(ap || null);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-primary mb-4">📊 Statistics Dashboard</h2>
        <p>Loading statistics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-primary mb-4">📊 Statistics Dashboard</h2>
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
        <button className="btn btn-outline-secondary" onClick={handleRefresh}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="text-primary">📊 Statistics Dashboard</h2>
        <button className="btn btn-outline-primary" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {/* Overall Appointment Statistics */}
      {appointmentStats && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Overall Appointment Summary</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 text-center">
                <h4 className="text-success">{appointmentStats.total || 0}</h4>
                <p className="text-muted">Total Appointments</p>
              </div>
              <div className="col-md-3 text-center">
                <h4 className="text-info">{appointmentStats.doctorCount || 0}</h4>
                <p className="text-muted">Unique Doctors</p>
              </div>
              <div className="col-md-3 text-center">
                <h4 className="text-warning">{appointmentStats.patientCount || 0}</h4>
                <p className="text-muted">Unique Patients</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments by Doctor */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Appointments by Doctor</h5>
        </div>
        <div className="card-body">
          {appointmentsByDoctor.length === 0 ? (
            <p className="text-muted">No appointment data</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Doctor</th>
                    <th className="text-center">Appointments</th>
                    <th>Patients</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsByDoctor.map((doc, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{doc._id || '—'}</strong>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success">{doc.count || 0}</span>
                      </td>
                      <td className="text-muted">{(doc.patients || []).join(', ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Statistics with Appointment Counts */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Doctor Profiles & Workload</h5>
        </div>
        <div className="card-body">
          {doctorStats.length === 0 ? (
            <p className="text-muted">No doctor data</p>
          ) : (
            <div className="row">
              {doctorStats.map((doc, idx) => (
                <div key={idx} className="col-md-6 mb-3">
                  <div className="card border-left border-3 border-primary">
                    <div className="card-body">
                      <h6 className="card-title mb-2">{doc.name}</h6>
                      <p className="card-text mb-1 text-muted">
                        <small>
                          <strong>Specialization:</strong> {doc.specialization || '—'}
                        </small>
                      </p>
                      <p className="card-text mb-1 text-muted">
                        <small>
                          <strong>Status:</strong> {doc.available ? '✅ Available' : '❌ Unavailable'}
                        </small>
                      </p>
                      <p className="card-text">
                        <strong>Appointments:</strong> {doc.appointmentCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bed Occupancy */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Bed Occupancy by Ward</h5>
        </div>
        <div className="card-body">
          {bedOccupancy.length === 0 ? (
            <p className="text-muted">No bed data</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ward</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Occupied</th>
                    <th className="text-center">Available</th>
                    <th className="text-center">Occupancy %</th>
                  </tr>
                </thead>
                <tbody>
                  {bedOccupancy.map((ward, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{ward._id || '—'}</strong>
                      </td>
                      <td className="text-center">{ward.total || 0}</td>
                      <td className="text-center">
                        <span className="badge bg-danger">{ward.occupied || 0}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success">{ward.available || 0}</span>
                      </td>
                      <td className="text-center">
                        <strong>{Math.round(ward.occupancyRate || 0)}%</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Medicine Stock */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">Medicine Stock Levels</h5>
        </div>
        <div className="card-body">
          {medicineStock.length === 0 ? (
            <p className="text-muted">No medicine data</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Medicine Name</th>
                    <th className="text-center">Stock</th>
                    <th className="text-center">Level</th>
                    <th className="text-center">Price (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {medicineStock.map((med, idx) => (
                    <tr key={idx}>
                      <td>{med.name || '—'}</td>
                      <td className="text-center">{med.stock || 0}</td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            med.stockLevel === 'Low'
                              ? 'bg-danger'
                              : med.stockLevel === 'Medium'
                              ? 'bg-warning text-dark'
                              : 'bg-success'
                          }`}
                        >
                          {med.stockLevel || '—'}
                        </span>
                      </td>
                      <td className="text-center">
                        {med.price
                          ? new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(med.price)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Patients by Disease History */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Patients by Disease History</h5>
        </div>
        <div className="card-body">
          {patientsByDisease.length === 0 ? (
            <p className="text-muted">No disease history data</p>
          ) : (
            <div className="row">
              {patientsByDisease.map((disease, idx) => (
                <div key={idx} className="col-md-6 mb-3">
                  <div className="card border-left border-3 border-success">
                    <div className="card-body">
                      <h6 className="card-title mb-3">
                        <span className="badge bg-success">{disease._id || 'Unknown'}</span>
                      </h6>
                      <p className="mb-2">
                        <strong>Patient Count:</strong> {disease.patientCount || 0}
                      </p>
                      <p className="text-muted mb-0">
                        <small>
                          <strong>Patients:</strong>
                          <br />
                          {(disease.patients || [])
                            .map((p) => `${p.name} (Age: ${p.age})`)
                            .join(', ') || '—'}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
