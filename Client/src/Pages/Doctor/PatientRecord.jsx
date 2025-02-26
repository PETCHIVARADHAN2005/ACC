import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Phone, Calendar, FileText } from 'lucide-react';
import '../../styles/PatientRecord.css';

const samplePatients = [
  {
    id: 1,
    name: "John Doe",
    age: 35,
    phone: "555-0101",
    appointments: [
      { date: "2025-02-10", time: "09:00 AM" },
      { date: "2024-12-15", time: "02:30 PM" }
    ],
    medicalHistory: [
      { condition: "Asthma", diagnosed: "2020", status: "Ongoing" },
      { condition: "Seasonal Allergies", diagnosed: "2018", status: "Managed" }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 42,
    phone: "555-0102",
    appointments: [
      { date: "2025-01-20", time: "11:00 AM" }
    ],
    medicalHistory: [
      { condition: "Hypertension", diagnosed: "2021", status: "Controlled" }
    ]
  },
  {
    id: 3,
    name: "Jane Smith",
    age: 28,
    phone: "555-0103",
    appointments: [
      { date: "2025-02-15", time: "03:00 PM" }
    ],
    medicalHistory: [
      { condition: "Migraine", diagnosed: "2019", status: "Managed" }
    ]
  },
  {
    id: 4,
    name: "David Wilson",
    age: 55,
    phone: "555-0104",
    appointments: [
      { date: "2025-02-12", time: "10:30 AM" }
    ],
    medicalHistory: [
      { condition: "Type 2 Diabetes", diagnosed: "2015", status: "Controlled" },
      { condition: "High Cholesterol", diagnosed: "2017", status: "Managed" }
    ]
  },
  {
    id: 5,
    name: "Mike Johnson",
    age: 31,
    phone: "555-0105",
    appointments: [
      { date: "2025-02-20", time: "02:00 PM" }
    ],
    medicalHistory: [
      { condition: "Anxiety", diagnosed: "2022", status: "Under Treatment" }
    ]
  }
];

const PatientRecord = () => {
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = samplePatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const togglePatient = (patientId) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId);
  };

  return (
    <div className="patient-list">
      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search patients by name or phone number..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="patients-container">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="patient-card">
            <div className="patient-header" onClick={() => togglePatient(patient.id)}>
              <div className="patient-summary">
                <div className="patient-info">
                  <h3 className="patient-name">{patient.name}</h3>
                  <div className="patient-details">
                    <span className="patient-age">Age: {patient.age}</span>
                    <div className="patient-phone">
                      <Phone className="phone-icon" />
                      {patient.phone}
                    </div>
                  </div>
                </div>
                {expandedPatient === patient.id ? 
                  <ChevronUp className="chevron-icon" /> : 
                  <ChevronDown className="chevron-icon" />
                }
              </div>
            </div>

            {expandedPatient === patient.id && (
              <div className="patient-details-expanded">
                <div className="appointments-section">
                  <h4 className="section-title">
                    <Calendar className="section-icon" />
                    Appointment History
                  </h4>
                  <div className="appointments-list">
                    {patient.appointments.map((apt, index) => (
                      <div key={index} className="appointment-item">
                        <span className="appointment-date">
                          {new Date(apt.date).toLocaleDateString()} {apt.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="medical-history-section">
                  <h4 className="section-title">
                    <FileText className="section-icon" />
                    Medical History
                  </h4>
                  <div className="medical-history-list">
                    {patient.medicalHistory.map((history, index) => (
                      <div key={index} className="medical-history-item">
                        <div className="medical-history-header">
                          <span className="condition">{history.condition}</span>
                          <span className="diagnosis-date">Diagnosed: {history.diagnosed}</span>
                        </div>
                        <span className="condition-status">Status: {history.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="no-results">
            No patients found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecord;