import React from "react";
import EmergencyButton from "./EmergencyButton";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const sections = [
    { title: "Patients", text: "Manage patient details & history.", path: "/patients" },
    { title: "Doctors", text: "View doctor details & schedules.", path: "/doctors" },
    { title: "Appointments", text: "Check and book appointments.", path: "/appointments" },
    { title: "Medicines", text: "Manage stock, expiry, and alternatives.", path: "/medicines" },
    { title: "Beds", text: "Track available and occupied beds.", path: "/beds" },
  ];

  return (
    <div>
      <h2 className="text-center mb-4 fw-bold text-primary">Hospital Dashboard</h2>
      <Row xs={1} md={3} className="g-4">
        {sections.map((s, idx) => (
          <Col key={idx}>
            <Card
              className="shadow-sm border-0"
              role="button"
              tabIndex={0}
              onClick={() => s.path && navigate(s.path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  s.path && navigate(s.path);
                }
              }}
              style={{ cursor: s.path ? "pointer" : "default" }}
            >
              <Card.Body>
                <Card.Title>{s.title}</Card.Title>
                <Card.Text>{s.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-5">
        <EmergencyButton />
      </div>
    </div>
  );
}

export default Dashboard;
