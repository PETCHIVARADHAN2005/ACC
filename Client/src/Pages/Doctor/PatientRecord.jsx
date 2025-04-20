import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/Doctorcontext';
import {
  FaSearch, FaUserInjured, FaPhoneAlt, FaEnvelope,
  FaArrowLeft, FaUser, FaCalendarAlt, FaMapMarkerAlt,
  FaNotesMedical, FaFileMedical, FaHistory, FaClock
} from 'react-icons/fa';
import '../../styles/PatientRecord.css';

const PatientRecord = () => {
  const { backendUrl, token } = useContext(DoctorContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/doctor/get-patients`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again later.');
        setLoading(false);
      }
    };
    fetchPatients();
  }, [backendUrl, token]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone_number?.includes(searchTerm) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Fetch patient details when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      const fetchPatientDetails = async () => {
        try {
          setDetailsLoading(true);
          console.log("Patient called");
          const response = await axios.get(`${backendUrl}/api/doctor/get-patient-details/${selectedPatient}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPatientDetails(response.data);
          setDetailsLoading(false);
        } catch (err) {
          console.error('Error fetching patient details:', err);
          setDetailsLoading(false);
        }
      };
      fetchPatientDetails();
    }
  }, [selectedPatient, backendUrl, token]);

  const handleViewDetails = (patientId) => {
    setSelectedPatient(patientId);
    setActiveTab('info');
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setPatientDetails(null);
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'Not specified';
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} years`;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your patients...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Oops! Something went wrong</h3>
      <p>{error}</p>
    </div>
  );

  // Show patient details view if a patient is selected
  if (selectedPatient) {
    if (detailsLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading patient details...</p>
        </div>
      );
    }
    if (!patientDetails) {
      return (
        <div className="error-container">
          <div className="error-icon">🔍</div>
          <h3>Patient Not Found</h3>
          <p>The patient you're looking for doesn't exist or you don't have access.</p>
          <button className="back-button" onClick={handleBackToList}>
            <FaArrowLeft /> Back to Patients
          </button>
        </div>
      );
    }
    return (
      <div className="patient-details-container">
        <div className="patient-details-header">
          <button className="back-link" onClick={handleBackToList}>
            <FaArrowLeft /> Back to Patients
          </button>
          <h1>
            <div className="patient-avatar large">
              {patientDetails.first_name?.charAt(0)}{patientDetails.last_name?.charAt(0)}
            </div>
            <span>
            {patientDetails.first_name} {patientDetails.last_name}
            </span>
          </h1>
        </div>
        <div className="patient-tabs">
          <button
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <FaUser /> Basic Info
          </button>
          <button
            className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            <FaNotesMedical /> Medical History
          </button>
          <button
            className={`tab-button ${activeTab === 'visits' ? 'active' : ''}`}
            onClick={() => setActiveTab('visits')}
          >
            <FaHistory /> Visit History
          </button>
        </div>
        <div className="patient-details-content">
          {activeTab === 'info' && (
            <div className="patient-info-section">
              <div className="info-card">
                <h3><FaUser className="card-icon" /> Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{patientDetails.first_name} {patientDetails.last_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    <span className="info-value">{patientDetails.gender || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date of Birth</span>
                    <span className="info-value">
                      {patientDetails.dob ? new Date(patientDetails.dob).toLocaleDateString() : 'Not specified'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age</span>
                    <span className="info-value">{calculateAge(patientDetails.dob)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Blood Group</span>
                    <span className="info-value">{patientDetails.blood_group || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <h3><FaPhoneAlt className="card-icon" /> Contact Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{patientDetails.phone_number}</span>
                  </div>
                  {patientDetails.email && (
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{patientDetails.email}</span>
                    </div>
                  )}
                  {patientDetails.emergency_contact && (
                    <div className="info-item">
                      <span className="info-label">Emergency Contact</span>
                      <span className="info-value">{patientDetails.emergency_contact}</span>
                    </div>
                  )}
                </div>
              </div>
              {patientDetails.address && (
                <div className="info-card">
                  <h3><FaMapMarkerAlt className="card-icon" /> Address</h3>
                  <div className="info-grid">
                    <div className="info-item full-width">
                      <span className="info-value address">{patientDetails.address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'medical' && (
            <div className="patient-medical-section">
              {patientDetails.medicalHistory && patientDetails.medicalHistory.length > 0 ? (
                <div className="medical-history-list">
                  {patientDetails.medicalHistory.map((record, index) => (
                    <div className="medical-record-card" key={index}>
                      <div className="record-header">
                        <h3>{record.condition}</h3>
                        <span className="record-date">
                          <FaCalendarAlt /> {new Date(record.diagnosis_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="record-notes">{record.notes}</p>
                      {record.medications && (
                        <div className="medications">
                          <h4>Medications</h4>
                          <ul>
                            {record.medications.map((med, idx) => (
                              <li key={idx}>{med.name} - {med.dosage}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-message">
                  <div className="no-data-icon">📋</div>
                  <h3>No Medical History</h3>
                  <p>This patient doesn't have any medical history records yet.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'visits' && (
            <div className="patient-visits-section">
              {patientDetails.visitHistory && patientDetails.visitHistory.length > 0 ? (
                <div className="visits-timeline">
                  {patientDetails.visitHistory.map((visit, index) => (
                    <div className="visit-card" key={index}>
                      <div className="visit-date">
                        <FaCalendarAlt className="visit-icon" />
                        <span>{new Date(visit.date).toLocaleDateString()}</span>
                      </div>
                      <div className="visit-time">
                        <FaClock className="visit-icon" />
                        <span>{visit.time}</span>
                      </div>
                      <h3 className="visit-reason">{visit.reason}</h3>
                      <div className="visit-details">
                        <p><strong>Symptoms:</strong> {visit.symptoms}</p>
                        <p><strong>Diagnosis:</strong> {visit.diagnosis}</p>
                        {visit.prescription && (
                          <div className="prescription">
                            <h4><FaFileMedical /> Prescription</h4>
                            <ul>
                              {visit.prescription.map((med, idx) => (
                                <li key={idx}>
                                  {med.name} - {med.dosage} - {med.instructions}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {visit.notes && (
                          <div className="visit-notes">
                            <h4>Notes</h4>
                            <p>{visit.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-message">
                  <div className="no-data-icon">🗓️</div>
                  <h3>No Visit History</h3>
                  <p>This patient hasn't had any visits recorded yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show patients list if no patient is selected
  return (
    <div className="patients-container">
      <div className="patients-header">
        <h2><FaUserInjured className="header-icon" /> My Patients</h2>
        <div className="patients-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search patients by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
      {filteredPatients.length === 0 ? (
        <div className="no-patients">
          <div className="no-data-icon">👨‍⚕️</div>
          <h3>No patients found</h3>
          <p>{searchTerm ? 'Try a different search term.' : 'You don\'t have any patients yet.'}</p>
        </div>
      ) : (
        <div className="patients-grid">
          {filteredPatients.map(patient => (
            <div
              key={patient.patient_id}
              className="patient-card"
            >
              <div className="patient-avatar">
                {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
              </div>
              <div className="patient-info">
                <h3>{patient.first_name} {patient.last_name}</h3>
                <p className="patient-details">
                  <FaPhoneAlt className="detail-icon" />
                  <span>{patient.phone_number}</span>
                </p>
                {patient.email && (
                  <p className="patient-details">
                    <FaEnvelope className="detail-icon" />
                    <span>{patient.email}</span>
                  </p>
                )}
              </div>
              <div className="patient-action">
                <button
                  className="view-details-btn"
                  onClick={() => handleViewDetails(patient.patient_id)}
                >
                  View Details
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecord;

