import React, { useState } from 'react';
import { Calendar, Clock, Search } from 'lucide-react';
import '../../styles/DoctorAppointment.css';

const DoctorAppointment = ({ appointments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'upcoming', 'today', 'previous'

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter appointments based on time period
  const filterAppointmentsByTime = (appointments) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      switch (timeFilter) {
        case 'upcoming':
          return appointmentDate > today;
        case 'today':
          return appointmentDate.getTime() === today.getTime();
        case 'previous':
          return appointmentDate < today;
        default:
          return true;
      }
    });
  };

  // Group appointments by date
  const groupedAppointments = filterAppointmentsByTime(appointments).reduce((groups, appointment) => {
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

  // Convert grouped appointments to an array and sort by date in descending order
  const sortedAppointments = Object.entries(groupedAppointments)
    .map(([date, apps]) => ({
      date,
      timestamp: new Date(apps[0].date).getTime(),
      appointments: apps.filter(app =>
        app.patient.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(group => group.appointments.length > 0)
    .sort((a, b) => b.timestamp - a.timestamp);

  // Get counts for filter badges
  const getCounts = () => {
    const counts = {
      all: appointments.length,
      upcoming: 0,
      today: 0,
      previous: 0
    };

    appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate > today) {
        counts.upcoming++;
      } else if (appointmentDate.getTime() === today.getTime()) {
        counts.today++;
      } else {
        counts.previous++;
      }
    });

    return counts;
  };

  const counts = getCounts();

  return (
    <div className="appointments-container">
      {/* Search and Filter Bar */}
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
        <div className="time-filters">
          <button 
            className={`filter-button ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            All ({counts.all})
          </button>
          <button 
            className={`filter-button ${timeFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setTimeFilter('upcoming')}
          >
            Upcoming ({counts.upcoming})
          </button>
          <button 
            className={`filter-button ${timeFilter === 'today' ? 'active' : ''}`}
            onClick={() => setTimeFilter('today')}
          >
            Today ({counts.today})
          </button>
          <button 
            className={`filter-button ${timeFilter === 'previous' ? 'active' : ''}`}
            onClick={() => setTimeFilter('previous')}
          >
            Previous ({counts.previous})
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {sortedAppointments.map(({ date, appointments }) => (
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

      {sortedAppointments.length === 0 && (
        <div className="no-appointments">
          <p>No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointment;