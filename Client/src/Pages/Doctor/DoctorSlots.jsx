import React, { useState } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import '../../styles/DoctorSlots.css';

const DoctorSlots = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selecting, setSelecting] = useState('start'); // 'start' or 'end'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });

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

  const handleDateClick = (day) => {
    if (!day) return;

    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (selecting === 'start') {
      setDateRange({ start: selectedDate, end: null });
      setSelecting('end');
    } else {
      if (selectedDate >= dateRange.start) {
        setDateRange(prev => ({ ...prev, end: selectedDate }));
        setSelecting('start');
      }
    }
  };

  const handleAddTimeSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      setTimeSlots([...timeSlots, { ...newSlot }]);
      setNewSlot({ startTime: '', endTime: '' });
    }
  };

  const handleRemoveTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleSaveSlots = () => {
    // Here you would implement the logic to save the slots
    console.log('Saving slots:', {
      dateRange,
      timeSlots
    });
  };

  const isDateInRange = (day) => {
    if (!day || !dateRange.start) return false;
    const currentDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    if (!dateRange.end) {
      return currentDate.getTime() === dateRange.start.getTime();
    }

    return (
      currentDate >= dateRange.start && 
      currentDate <= dateRange.end
    );
  };

  return (
    <div className="manage-slots">
      <div className="date-range-section">
        <div className="section-header">
          <h2>Select Date Range</h2>
        </div>
        <div className="calendar-container">
          <div className="calendar-header">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              className="month-nav-btn"
            >
              ←
            </button>
            <span className="current-month">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              className="month-nav-btn"
            >
              →
            </button>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day ? 'has-date' : ''} ${
                  isDateInRange(day) ? 'selected' : ''
                }`}
                onClick={() => day && handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="selected-range">
            <p>
              Selected Range:{' '}
              {dateRange.start
                ? dateRange.start.toLocaleDateString()
                : 'Select start date'}{' '}
              -{' '}
              {dateRange.end
                ? dateRange.end.toLocaleDateString()
                : 'Select end date'}
            </p>
          </div>
        </div>
      </div>

      <div className="time-slots-section">
        <div className="section-header">
          <h2>Set Available Time Slots</h2>
        </div>
        <div className="time-slots-container">
          <div className="add-slot-container">
            <div className="time-input-group">
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, startTime: e.target.value })
                }
                className="time-input"
              />
              <span>to</span>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, endTime: e.target.value })
                }
                className="time-input"
              />
            </div>
            <button 
              onClick={handleAddTimeSlot}
              className="add-slot-btn"
            >
              <Plus className="icon" />
              Add Slot
            </button>
          </div>

          <div className="time-slots-list">
            {timeSlots.map((slot, index) => (
              <div key={index} className="time-slot-item">
                <Clock className="icon" />
                <span>
                  {slot.startTime} - {slot.endTime}
                </span>
                <button
                  onClick={() => handleRemoveTimeSlot(index)}
                  className="remove-slot-btn"
                >
                  <X className="icon" />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={handleSaveSlots}
            className="save-slots-btn"
            disabled={!dateRange.start || !dateRange.end || timeSlots.length === 0}
          >
            Save Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSlots;