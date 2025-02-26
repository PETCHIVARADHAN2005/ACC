import React, { useState } from 'react';
import { Calendar, Clock, Search } from 'lucide-react';
import '../../styles/DoctorAppointment.css';

const DoctorAppointment = ({appointments}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample appointments data - removed type and status

  // Group appointments by date
  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const date = new Date(appointment.date);
    const dateString = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(appointment);
    return groups;
  }, {});

  // Filter appointments by search only
  const filteredDates = Object.entries(groupedAppointments)
    .map(([date, apps]) => ({
      date,
      appointments: apps.filter(app => 
        app.patient.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(group => group.appointments.length > 0);

  return (
    <div className="appointments-container">
      {/* Search Bar */}
      <div className="search-filters">
        <div className="search-input">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Appointments List */}
      {filteredDates.map(({ date, appointments }) => (
        <div className="appointment-group" key={date}>
          <div className="date-header">
            <Calendar className="date-icon" />
            <h2>{date}</h2>
          </div>
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-content">
                  <div className="time-container">
                    <Clock className="time-icon" />
                  </div>
                  <div className="appointment-details">
                    <h3>{appointment.patient}</h3>
                    <p className="appointment-time">{appointment.time}</p>
                  </div>
                  <div className="appointment-actions">
                    <button className="view-button">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredDates.length === 0 && (
        <div className="no-appointments">
          <p>No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointment;