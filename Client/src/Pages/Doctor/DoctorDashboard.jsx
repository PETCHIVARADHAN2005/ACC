import React, { useState, useEffect, useContext } from 'react';
import { Users, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { DoctorContext } from '../../context/Doctorcontext';
import { Link } from 'react-router-dom';
import '../../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  const { backendUrl, token } = useContext(DoctorContext);
  const [dashboardData, setDashboardData] = useState({
    total_patients: 0,
    total_appointments: 0,
    today_appointments: [],
    recent_appointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const doctorData = JSON.parse(localStorage.getItem('doctor-data')) || {};

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`${backendUrl}/api/doctor/get-doctor-dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setDashboardData(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl, token]);

  // Format time from 24h to 12h format
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {error && (
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>Welcome, Dr. {dashboardData.doctor_name || 'Doctor'}</h1>
        <p className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon patients-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Patients</h3>
            <p className="stat-value">{dashboardData.total_patients}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon appointments-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Appointments</h3>
            <p className="stat-value">{dashboardData.total_appointments}</p>
          </div>
        </div>
      </div>
      
      {/* Today's Appointments */}
      {/* <div className="dashboard-card">
        <div className="card-header">
          <h2>
            <Calendar className="card-header-icon" />
            Today's Appointments
          </h2>
          <Link to="/doctor/appointments" className="view-all-link">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="card-content">
          {dashboardData.today_appointments.length > 0 ? (
            <div className="appointments-list">
              {dashboardData.today_appointments.map((appointment, index) => (
                <div className="appointment-item" key={appointment.appointment_id || index}>
                  <div className="appointment-time">
                    <Clock size={16} className="time-icon" />
                    <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                  </div>
                  <div className="appointment-details">
                    <h3>{appointment.first_name} {appointment.last_name}</h3>
                    <p className="appointment-type">{appointment.appointment_type || 'Consultation'}</p>
                    {appointment.phone_number && (
                      <p className="patient-phone">{appointment.phone_number}</p>
                    )}
                  </div>
                  <div className="appointment-status">
                    {new Date(`${appointment.appointment_date}T${appointment.start_time}`) > new Date() ? (
                      <span className="status upcoming">Upcoming</span>
                    ) : new Date(`${appointment.appointment_date}T${appointment.end_time}`) < new Date() ? (
                      <span className="status completed">Completed</span>
                    ) : (
                      <span className="status active">In Progress</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <Calendar size={48} className="no-data-icon" />
              <p>No appointments scheduled for today</p>
            </div>
          )}
        </div>
      </div> */}
      
      {/* Recent Appointments */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>
            <Clock className="card-header-icon" />
            Recent Appointments
          </h2>
          <Link to="/appointments" className="view-all-link">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="card-content">
          {dashboardData.recent_appointments.length > 0 ? (
            <div className="recent-appointments">
              {dashboardData.recent_appointments.map((appointment, index) => (
                <div className="recent-appointment-item" key={appointment.appointment_id || index}>
                  <div className="patient-avatar">
                    {appointment.first_name?.charAt(0)}{appointment.last_name?.charAt(0)}
                  </div>
                  <div className="recent-appointment-details">
                    <h3>{appointment.first_name} {appointment.last_name}</h3>
                    <div className="appointment-meta">
                      <span className="appointment-date">
                        <Calendar size={14} />
                        {formatDate(appointment.appointment_date)}
                      </span>
                      <span className="appointment-time">
                        <Clock size={14} />
                        {formatTime(appointment.start_time)}
                      </span>
                    </div>
                    {appointment.appointment_type && (
                      <span className="appointment-badge">
                        {appointment.appointment_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <User size={48} className="no-data-icon" />
              <p>No recent appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
