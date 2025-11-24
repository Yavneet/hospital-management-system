import React, { useEffect, useState } from "react";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMedicines() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/api/medicines", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Failed to load medicines");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMedicines();
    return () => controller.abort();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/medicines");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (p) => {
    if (p === null || p === undefined || p === "") return "—";
    const num = Number(p);
    if (Number.isNaN(num)) return String(p);
    // Format in Indian Rupees
    try {
      return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    } catch (e) {
      return num.toString();
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h3>Medicines Inventory</h3>
        <div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading medicines…</p>
      ) : error ? (
        <div>
          <p className="text-danger">Error: {error}</p>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      ) : medicines.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Stock</th>
              <th>Price (INR)</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m._id || m.name}>
                <td>{m.name || m.title || "—"}</td>
                <td>{m.stock ?? m.quantity ?? "—"}</td>
                <td className="d-flex align-items-center justify-content-between">
                  <span>{formatPrice(m.price)}</span>
                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={async () => {
                      if (!m._id) return;
                      if (!window.confirm(`Delete ${m.name}?`)) return;
                      try {
                        const res = await fetch(`http://localhost:5000/api/medicines/${m._id}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error('Delete failed');
                        // refresh
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

export default Medicines;
