import React, { useState, useEffect, useContext } from 'react';
import { Search, Calendar, Clock, User, Filter, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { DoctorContext } from '../../context/Doctorcontext';
import '../../styles/DoctorAppointment.css';

const DoctorAppointment = () => {
  const { backendUrl, token } = useContext(DoctorContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'past', 'today', 'upcoming'
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Get doctor_id from localStorage
        const doctorData = JSON.parse(localStorage.getItem('doctor-data'));
        
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

  // Filter patients based on time period
  const filterPatientsByTime = (patients) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return patients.filter(patient => {
      // Check if patient has last_appointment (past) or next_appointment (future)
      const lastAppointment = patient.last_appointment ? new Date(patient.last_appointment) : null;
      const nextAppointment = patient.next_appointment ? new Date(patient.next_appointment) : null;
      
      switch (timeFilter) {
        case 'past':
          // Patients with past appointments but no future ones
          return lastAppointment && !nextAppointment;
        case 'today':
          // Patients with appointments today
          if (!nextAppointment) return false;
          const appointmentDate = new Date(nextAppointment);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === today.getTime();
        case 'upcoming':
          // Patients with future appointments
          if (!nextAppointment) return false;
          const futureDate = new Date(nextAppointment);
          futureDate.setHours(0, 0, 0, 0);
          return futureDate > today;
        default:
          return true;
      }
    });
  };

  // Filter patients by search query
  const searchPatients = (patients) => {
    if (!searchQuery.trim()) return patients;
    
    return patients.filter(patient => 
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone_number?.includes(searchQuery) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get filtered patients
  const filteredPatients = searchPatients(filterPatientsByTime(patients));

  // Group patients by first letter of last name
  const groupedPatients = filteredPatients.reduce((groups, patient) => {
    const firstLetter = patient.last_name?.charAt(0).toUpperCase() || '#';
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(patient);
    return groups;
  }, {});

  // Convert grouped patients to an array and sort alphabetically
  const sortedPatientGroups = Object.entries(groupedPatients)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, patients]) => ({
      letter,
      patients: patients.sort((a, b) => 
        a.last_name.localeCompare(b.last_name) || 
        a.first_name.localeCompare(b.first_name)
      )
    }));

  // Get counts for filter badges
  const getCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const counts = {
      all: patients.length,
      past: 0,
      today: 0,
      upcoming: 0
    };

    patients.forEach(patient => {
      const lastAppointment = patient.last_appointment ? new Date(patient.last_appointment) : null;
      const nextAppointment = patient.next_appointment ? new Date(patient.next_appointment) : null;
      
      if (lastAppointment && !nextAppointment) {
        counts.past++;
      }
      
      if (nextAppointment) {
        const appointmentDate = new Date(nextAppointment);
        appointmentDate.setHours(0, 0, 0, 0);
        
        if (appointmentDate.getTime() === today.getTime()) {
          counts.today++;
        } else if (appointmentDate > today) {
          counts.upcoming++;
        }
      }
    });
    
    return counts;
  };

  const counts = getCounts();

  // Get appointment status class based on date
  const getAppointmentStatusClass = (appointmentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);
    
    if (apptDate < today) {
      return "appointment-past";
    } else if (apptDate.getTime() === today.getTime()) {
      return "appointment-today";
    } else {
      return "appointment-upcoming";
    }
  };

  // Handle view patient details
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  if (loading) {
    return (
      <div className="patients-loading">
        <div className="loading-spinner"></div>
        <p>Loading patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patients-error">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  // If a patient is selected, show their details
  if (selectedPatient) {
    return (
      <div className="patient-details-view">
        <button className="back-to-list" onClick={handleBackToList}>
          <ChevronRight className="back-icon" /> Back to patients list
        </button>
        
        <div className="patient-header">
          <div className="patient-avatar">
            {selectedPatient.first_name?.charAt(0)}{selectedPatient.last_name?.charAt(0)}
          </div>
          <div className="patient-name-info">
            <h2>{selectedPatient.first_name} {selectedPatient.last_name}</h2>
            <div className="patient-meta">
              <span className="patient-id">ID: {selectedPatient.patient_id}</span>
              {selectedPatient.visit_count > 0 && (
                <span className="visit-count">{selectedPatient.visit_count} visits</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="patient-info-grid">
          <div className="info-card">
            <h3>Contact Information</h3>
            <div className="info-content">
              {selectedPatient.phone_number && (
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{selectedPatient.phone_number}</span>
                </div>
              )}
              {selectedPatient.email && (
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{selectedPatient.email}</span>
                </div>
              )}
              {selectedPatient.address && (
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{selectedPatient.address}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="info-card">
            <h3>Medical Information</h3>
            <div className="info-content">
              {selectedPatient.gender && (
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{selectedPatient.gender}</span>
                </div>
              )}
              {selectedPatient.age && (
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{selectedPatient.age} years</span>
                </div>
              )}
              {selectedPatient.blood_group && (
                <div className="info-item">
                  <span className="info-label">Blood Group</span>
                  <span className="info-value">{selectedPatient.blood_group}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="info-card">
            <h3>Appointment Information</h3>
            <div className="info-content">
              {selectedPatient.last_appointment && (
                <div className="info-item">
                  <span className="info-label">Last Appointment</span>
                  <span className={`info-value ${getAppointmentStatusClass(selectedPatient.last_appointment)}`}>
                    {new Date(selectedPatient.last_appointment).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {selectedPatient.next_appointment && (
                <div className="info-item">
                  <span className="info-label">Next Appointment</span>
                  <span className={`info-value ${getAppointmentStatusClass(selectedPatient.next_appointment)}`}>
                    {new Date(selectedPatient.next_appointment).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* <div className="info-card actions-card">
            <h3>Actions</h3>
            <div className="patient-actions">
              <button className="action-button primary">Schedule Appointment</button>
              <button className="action-button secondary">View Medical Records</button>
              <button className="action-button tertiary">Send Message</button>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="patients-container">
      {/* Search and Filter Bar */}
      <div className="patients-search-filters">
        <div className="search-input">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search patients by name, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="patients-time-filters">
          <button
            className={`filter-button ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            All Patients ({counts.all})
          </button>
          <button
            className={`filter-button ${timeFilter === 'today' ? 'active' : ''}`}
            onClick={() => setTimeFilter('today')}
          >
            Today's Appointments ({counts.today})
          </button>
          <button
            className={`filter-button ${timeFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setTimeFilter('upcoming')}
          >
            Upcoming Appointments ({counts.upcoming})
          </button>
          <button
            className={`filter-button ${timeFilter === 'past' ? 'active' : ''}`}
            onClick={() => setTimeFilter('past')}
          >
            Past Appointments ({counts.past})
          </button>
        </div>
      </div>

      {/* Patients List */}
      {sortedPatientGroups.length > 0 ? (
        sortedPatientGroups.map(({ letter, patients }) => (
          <div className="patients-group" key={letter}>
            <div className="letter-header">
              <div className="letter-badge">{letter}</div>
            </div>
            <div className="patients-list">
              {patients.map((patient) => (
                <div key={patient.patient_id} className="patient-card">
                  <div className="patient-card-content">
                    <div className="patient-initials">
                      {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                    </div>
                    <div className="patient-card-details">
                      <h3>{patient.first_name} {patient.last_name}</h3>
                      <div className="patient-card-info">
                        {patient.phone_number && (
                          <p className="patient-phone">{patient.phone_number}</p>
                        )}
                        
                        {/* Show appointment information with appropriate styling */}
                        {patient.next_appointment && (
                          <p className={`patient-appointment ${getAppointmentStatusClass(patient.next_appointment)}`}>
                            <Calendar className="info-icon" />
                            Next appointment: {new Date(patient.next_appointment).toLocaleDateString()}
                          </p>
                        )}
                        {!patient.next_appointment && patient.last_appointment && (
                          <p className="patient-appointment appointment-past">
                            <Clock className="info-icon" />
                            Last appointment: {new Date(patient.last_appointment).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="patient-card-actions">
                      <button 
                        className="view-patient-button"
                        onClick={() => handleViewPatient(patient)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="no-patients">
          <User className="no-data-icon" />
          <h3>No patients found</h3>
          <p>
            {searchQuery 
              ? `No patients match your search "${searchQuery}". Try a different search term.`: `No patients found for the selected filter.`}
              </p>
            </div>
          )}
        </div>
      );
    };
    
    export default DoctorAppointment;
