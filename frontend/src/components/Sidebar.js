import React from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/patients", label: "🧑‍🤝‍🧑 Patients" },
  { to: "/doctors", label: "👨‍⚕️ Doctors" },
  { to: "/appointments", label: "📅 Appointments" },
  { to: "/medicines", label: "💊 Medicines" },
  { to: "/beds", label: "🛏️ Beds" },
  { to: "/stats", label: "📊 Stats" },
];

export default function Sidebar() {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const name = typeof window !== 'undefined' ? localStorage.getItem('name') : null;

  return (
    <nav
      aria-label="Main navigation"
      className="d-flex flex-column flex-shrink-0 p-3 bg-light shadow"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h5 className="text-center mb-4 text-primary">Dashboard</h5>

      <ul className="nav nav-pills flex-column mb-auto" role="menu">
        {/* If not logged in, show login links */}
        {!role && (
          <>
            <li className="nav-item" role="none">
              <NavLink to="/patient-login" role="menuitem" className={({ isActive }) => `nav-link ${isActive ? "active fw-bold" : "text-dark"}`}>
                🧑 Patient Login
              </NavLink>
            </li>
            <li className="nav-item mb-3" role="none">
              <NavLink to="/doctor-login" role="menuitem" className={({ isActive }) => `nav-link ${isActive ? "active fw-bold" : "text-dark"}`}>
                👨‍⚕️ Doctor Login
              </NavLink>
            </li>
          </>
        )}

        {/* If logged in, show role-specific dashboard link */}
        {role && (
          <li className="nav-item mb-3" role="none">
            <NavLink to={role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} role="menuitem" className={({ isActive }) => `nav-link ${isActive ? "active fw-bold" : "text-dark"}`}>
              {role === 'doctor' ? '👨‍⚕️ My Dashboard' : '🧑 My Dashboard'}
            </NavLink>
            {name && <div className="small text-muted mt-1">{name}</div>}
          </li>
        )}

        {/* Primary app links */}
        {LINKS.map((l) => (
          <li className="nav-item" key={l.to} role="none">
            <NavLink
              to={l.to}
              role="menuitem"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active fw-bold" : "text-dark"}`
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}

        <li className="nav-item mt-3" role="none">
          <NavLink
            to="/emergency"
            role="menuitem"
            className={({ isActive }) =>
              `nav-link text-danger fw-bold ${isActive ? "active" : ""}`
            }
          >
            🚨 Emergency
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
