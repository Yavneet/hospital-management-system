import React, { useEffect, useState } from "react";

function Beds() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/beds");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setBeds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load beds");
    } finally {
      setLoading(false);
    }
  };

  const formatOccupied = (val) => {
    if (val === null || val === undefined) return "—";
    return val ? "Yes" : "No";
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h3>Available Beds</h3>
        <div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading beds…</p>
      ) : error ? (
        <div>
          <p className="text-danger">Error: {error}</p>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      ) : beds.length === 0 ? (
        <p>No beds found.</p>
      ) : (
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Bed Number</th>
              <th>Type</th>
              <th>Occupied</th>
            </tr>
          </thead>
          <tbody>
            {beds.map((b) => (
              <tr key={b._id || `${b.bedNumber || "unknown"}`}>
                <td>{b.bedNumber ?? b.number ?? "—"}</td>
                <td>{b.type || "—"}</td>
                <td className="d-flex align-items-center justify-content-between">
                  <span>{formatOccupied(b.isOccupied)}</span>
                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={async () => {
                      if (!b._id) return;
                      if (!window.confirm(`Delete bed ${b.bedNumber}?`)) return;
                      try {
                        const res = await fetch(`http://localhost:5000/api/beds/${b._id}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error('Delete failed');
                        handleRefresh();
                      } catch (err) {
                        console.error(err);
                        setError(err.message || 'Delete failed');
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Beds;
