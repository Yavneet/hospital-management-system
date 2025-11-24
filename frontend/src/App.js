import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Patients from "./components/Patients";
import Doctors from "./components/Doctors";
import Appointments from "./components/Appointments";
import Medicines from "./components/Medicines";
import Beds from "./components/Beds";
import PatientLogin from "./components/PatientLogin";
import DoctorLogin from "./components/DoctorLogin";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import EmergencyButton from "./components/EmergencyButton";
import Footer from "./components/Footer";
import StatsBoard from "./components/StatsBoard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container-fluid mt-4">
          <div className="row">
            <div className="col-md-3">
              <Sidebar />
            </div>
            <div className="col-md-9">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/medicines" element={<Medicines />} />
                <Route path="/beds" element={<Beds />} />
                <Route path="/patient-login" element={<PatientLogin />} />
                <Route path="/doctor-login" element={<DoctorLogin />} />
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/stats" element={<StatsBoard />} />
                <Route path="/emergency" element={<EmergencyButton />} />
              </Routes>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
