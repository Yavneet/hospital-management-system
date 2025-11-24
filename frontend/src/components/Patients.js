import React, { useEffect, useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPatients() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/api/patients", { signal: controller.signal });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to load patients");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
    return () => controller.abort();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/patients");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-primary mb-3">🧑‍🤝‍🧑 Patient Records</h2>
        <div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading patients…</p>
      ) : error ? (
        <div>
          <p className="text-danger">Error: {error}</p>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleRefresh}>Retry</button>
        </div>
      ) : patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>History</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id || p.name}>
                  <td>{p.name}</td>
                  <td>{p.age ?? '—'}</td>
                  <td>{p.gender ?? '—'}</td>
                  <td>{(p.diseaseHistory && p.diseaseHistory.join(', ')) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
