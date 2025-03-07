import React, { useContext, useEffect, useState } from 'react';
import { Calendar, Clock, Users, FileText, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/DoctorHome.css';
import AppointmentsView from './DoctorAppointment';
import PatientList from './PatientRecord';
import ManageSlots from './DoctorSlots';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/Doctorcontext';
import DigitalPrescription from './DigitalPrescription';
 // Assuming you're using lucide-react for icons

// Inside your component:


const DoctorHome = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const {token,setToken,logout } = useContext(DoctorContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Logging out...');
        setToken(null);
        localStorage.removeItem('doctor-token');
        // logout(); // This will clear token from localStorage and context
        navigate('/'); // Redirect to login page
    };

    const handleProfileClick = () => {
        navigate('/doctor-profile'); // Navigate to doctor profile route
    };

    // Sample appointments data
    const appointments = [
        { id: 1, patient: "John Doe", time: "09:00 AM", date: "2025-02-11" },
        { id: 2, patient: "Jane Smith", time: "10:30 AM", date: "2025-02-11" },
        { id: 3, patient: "Mike Johnson", time: "02:00 PM", date: "2025-02-11" },
        { id: 3, patient: "Mike ", time: "02:00 PM", date: "2025-02-17" },
    ];



    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Calendar className="menu-icon" /> },
        { id: 'appointments', label: 'Appointments', icon: <Clock className="menu-icon" /> },
        { id: 'patients', label: 'Patients', icon: <Users className="menu-icon" /> },
        { id: 'prescriptions', label: 'Digital Prescription', icon: <FileText className="menu-icon" /> },
        { id: 'slots', label: 'Manage Slots', icon: <Clock className="menu-icon" /> },
    ];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const generateCalendarDays = () => {
        const { days, firstDay } = getDaysInMonth(currentMonth);
        const calendar = [];

        for (let i = 0; i < firstDay; i++) {
            calendar.push(null);
        }

        for (let day = 1; day <= days; day++) {
            calendar.push(day);
        }

        return calendar;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const getAppointmentsForDate = (day) => {
        if (!day) return [];
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return appointments.filter(apt => new Date(apt.date).toDateString() === date.toDateString());
    };
    return (
        <div className="doctor-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className='logo-title'>
                    <img src='../../../public/images/logo.png' alt='logo'></img>
                    <h1>Aruna Cardiac Care</h1>
                    </div>
                    <div className="profile-menu">
                        <button
                            className="profile-button"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <User />
                        </button>

                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <button className="dropdown-item" onClick={handleProfileClick}>
                                    <User className="dropdown-icon" />
                                    Profile
                                </button>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    <LogOut className="dropdown-icon" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Menu */}
                <div className="dashboard-menu">
                    <div className="menu-items">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`menu-button ${activeView === item.id ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard View */}
                {activeView === 'dashboard' && (
                    <div className="dashboard-grid">
                        {/* Calendar Card */}
                        <div className="dashboard-card calendar-card">
                            <div className="card-header">
                                <div className="calendar-header">
                                    <h3 className="card-title">Calendar</h3>
                                    <div className="month-navigation">
                                        <button onClick={prevMonth} className="nav-button">
                                            <ChevronLeft />
                                        </button>
                                        <span className="current-month">
                                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button onClick={nextMonth} className="nav-button">
                                            <ChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="calendar-grid">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="calendar-day-header">
                                            {day}
                                        </div>
                                    ))}
                                    {generateCalendarDays().map((day, index) => {
                                        const appointments = getAppointmentsForDate(day);
                                        return (
                                            <div
                                                key={index}
                                                className={`calendar-day ${day ? 'has-date' : ''}`}
                                            >
                                                {day && (
                                                    <>
                                                        <div className="day-number">{day}</div>
                                                        {appointments.length > 0 && (
                                                            <div className="appointment-badge">
                                                                {appointments.length} appt{appointments.length !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Today's Appointments */}
                        <div className="dashboard-card appointments-card">
                            <div className="card-header">
                                <h3 className="card-title">Today's Appointments</h3>
                            </div>
                            <div className="card-content">
                                <div className="appointments-list">
                                    {appointments
                                        .filter(apt => {
                                            const aptDate = new Date(apt.date);
                                            const today = new Date();
                                            return aptDate.getFullYear() === today.getFullYear() &&
                                                aptDate.getMonth() === today.getMonth() &&
                                                aptDate.getDate() === today.getDate();
                                        })
                                        .map(apt => (
                                            <div key={apt.id} className="appointment-item">
                                                <div className="appointment-info">
                                                    <p className="patient-name">{apt.patient}</p>
                                                    <p className="appointment-time">{apt.time}</p>
                                                </div>
                                                <button className="view-button">
                                                    View
                                                </button>
                                            </div>
                                        ))}
                                    {appointments.filter(apt => {
                                        const aptDate = new Date(apt.date);
                                        const today = new Date();
                                        return aptDate.getFullYear() === today.getFullYear() &&
                                            aptDate.getMonth() === today.getMonth() &&
                                            aptDate.getDate() === today.getDate();
                                    }).length === 0 && (
                                            <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments View */}
                {activeView === 'appointments' && (
                    <div className="dashboard-card view-card">
                        <div className="card-header">
                            <h3 className="card-title">Appointments</h3>
                        </div>
                        <div className="card-content">
                            <div className="view-content">
                                <AppointmentsView appointments={appointments} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Patients View */}
                {activeView === 'patients' && (
                    <div className="dashboard-card view-card">
                        <div className="card-header">
                            <h3 className="card-title">Patients</h3>
                        </div>
                        <div className="card-content">
                            <PatientList />
                        </div>
                    </div>
                )}
                {/* Patients View */}
                {activeView === 'prescriptions' && (
                    <div className="dashboard-card view-card">
                        <div className="card-header">
                            <h3 className="card-title">Digital Prescription</h3>
                        </div>
                        <div className="card-content">
                            <DigitalPrescription/>
                        </div>
                    </div>
                )}

                {activeView === 'slots' && (
                    <div className="dashboard-card view-card">
                        <div className="card-header">
                            <h3 className="card-title">Slots</h3>
                        </div>
                        <div className="card-content">
                            <ManageSlots/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorHome;