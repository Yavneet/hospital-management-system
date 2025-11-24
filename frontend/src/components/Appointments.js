import React, { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAppointments() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/api/appointments", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to load appointments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
    return () => controller.abort();
  }, []);

  // Manual refresh (button) — calls the same fetch logic but without an abort signal
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/appointments");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d)) return String(value);
    return d.toLocaleString();
  };

  const getPatientName = (a) => {
    return (
      a.patientName ||
      (a.patient && (a.patient.name || a.patient.fullName)) ||
      a.patient ||
      "—"
    );
  };

  const getDoctorName = (a) => {
    return (
      a.doctorName ||
      (a.doctor && (a.doctor.name || a.doctor.fullName)) ||
      a.doctor ||
      "—"
    );
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h3>Appointments</h3>
        <div>
          <button className="btn btn-sm btn-outline-primary me-2" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading appointments…</p>
      ) : error ? (
        <div>
          <p className="text-danger">Error: {error}</p>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id || `${getPatientName(a)}-${a.date}`}>
                <td>{getPatientName(a)}</td>
                <td>{getDoctorName(a)}</td>
                <td>{formatDate(a.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Appointments;
