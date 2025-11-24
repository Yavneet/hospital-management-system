import React, { useEffect, useState } from "react";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDoctors() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/api/doctors", { signal: controller.signal });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to load doctors");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
    return () => controller.abort();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/doctors");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-primary mb-3">👨‍⚕️ Doctor Information</h2>
        <div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading doctors…</p>
      ) : error ? (
        <div>
          <p className="text-danger">Error: {error}</p>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleRefresh}>Retry</button>
        </div>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d._id || d.name}>
                  <td>{d.name}</td>
                  <td>{d.specialization ?? '—'}</td>
                  <td>{d.available ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
