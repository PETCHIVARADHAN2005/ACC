// import React, { useState } from 'react';
// import { Calendar, Clock, Plus, X } from 'lucide-react';
// import '../../styles/DoctorSlots.css';

// const DoctorSlots = () => {
//   const [dateRange, setDateRange] = useState({ start: null, end: null });
//   const [selecting, setSelecting] = useState('start'); // 'start' or 'end'
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });

//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const days = new Date(year, month + 1, 0).getDate();
//     const firstDay = new Date(year, month, 1).getDay();
//     return { days, firstDay };
//   };

//   const generateCalendarDays = () => {
//     const { days, firstDay } = getDaysInMonth(currentMonth);
//     const calendar = [];

//     for (let i = 0; i < firstDay; i++) {
//       calendar.push(null);
//     }

//     for (let day = 1; day <= days; day++) {
//       calendar.push(day);
//     }

//     return calendar;
//   };

//   const handleDateClick = (day) => {
//     if (!day) return;

//     const selectedDate = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth(),
//       day
//     );

//     if (selecting === 'start') {
//       setDateRange({ start: selectedDate, end: null });
//       setSelecting('end');
//     } else {
//       if (selectedDate >= dateRange.start) {
//         setDateRange(prev => ({ ...prev, end: selectedDate }));
//         setSelecting('start');
//       }
//     }
//   };

//   const handleAddTimeSlot = () => {
//     if (newSlot.startTime && newSlot.endTime) {
//       setTimeSlots([...timeSlots, { ...newSlot }]);
//       setNewSlot({ startTime: '', endTime: '' });
//     }
//   };

//   const handleRemoveTimeSlot = (index) => {
//     setTimeSlots(timeSlots.filter((_, i) => i !== index));
//   };

//   const handleSaveSlots = () => {
//     // Here you would implement the logic to save the slots
//     console.log('Saving slots:', {
//       dateRange,
//       timeSlots
//     });
//   };

//   const isDateInRange = (day) => {
//     if (!day || !dateRange.start) return false;
//     const currentDate = new Date(
//       currentMonth.getFullYear(),
//       currentMonth.getMonth(),
//       day
//     );
    
//     if (!dateRange.end) {
//       return currentDate.getTime() === dateRange.start.getTime();
//     }

//     return (
//       currentDate >= dateRange.start && 
//       currentDate <= dateRange.end
//     );
//   };

//   return (
//     <div className="manage-slots">
//       <div className="date-range-section">
//         <div className="section-header">
//           <h2>Select Date Range</h2>
//         </div>
//         <div className="calendar-container">
//           <div className="calendar-header">
//             <button 
//               onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
//               className="month-nav-btn"
//             >
//               ←
//             </button>
//             <span className="current-month">
//               {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
//             </span>
//             <button 
//               onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
//               className="month-nav-btn"
//             >
//               →
//             </button>
//           </div>
//           <div className="calendar-grid">
//             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//               <div key={day} className="calendar-day-header">
//                 {day}
//               </div>
//             ))}
//             {generateCalendarDays().map((day, index) => (
//               <div
//                 key={index}
//                 className={`calendar-day ${day ? 'has-date' : ''} ${
//                   isDateInRange(day) ? 'selected' : ''
//                 }`}
//                 onClick={() => day && handleDateClick(day)}
//               >
//                 {day}
//               </div>
//             ))}
//           </div>
          
//           <div className="selected-range">
//             <p>
//               Selected Range:{' '}
//               {dateRange.start
//                 ? dateRange.start.toLocaleDateString()
//                 : 'Select start date'}{' '}
//               -{' '}
//               {dateRange.end
//                 ? dateRange.end.toLocaleDateString()
//                 : 'Select end date'}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="time-slots-section">
//         <div className="section-header">
//           <h2>Set Available Time Slots</h2>
//         </div>
//         <div className="time-slots-container">
//           <div className="add-slot-container">
//             <div className="time-input-group">
//               <input
//                 type="time"
//                 value={newSlot.startTime}
//                 onChange={(e) =>
//                   setNewSlot({ ...newSlot, startTime: e.target.value })
//                 }
//                 className="time-input"
//               />
//               <span>to</span>
//               <input
//                 type="time"
//                 value={newSlot.endTime}
//                 onChange={(e) =>
//                   setNewSlot({ ...newSlot, endTime: e.target.value })
//                 }
//                 className="time-input"
//               />
//             </div>
//             <button 
//               onClick={handleAddTimeSlot}
//               className="add-slot-btn"
//             >
//               <Plus className="icon" />
//               Add Slot
//             </button>
//           </div>

//           <div className="time-slots-list">
//             {timeSlots.map((slot, index) => (
//               <div key={index} className="time-slot-item">
//                 <Clock className="icon" />
//                 <span>
//                   {slot.startTime} - {slot.endTime}
//                 </span>
//                 <button
//                   onClick={() => handleRemoveTimeSlot(index)}
//                   className="remove-slot-btn"
//                 >
//                   <X className="icon" />
//                 </button>
//               </div>
//             ))}
//           </div>

//           <button 
//             onClick={handleSaveSlots}
//             className="save-slots-btn"
//             disabled={!dateRange.start || !dateRange.end || timeSlots.length === 0}
//           >
//             Save Slots
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorSlots;


import React, { useState, useEffect } from 'react';
import '../../styles/DoctorSlots.css';

const DoctorSlots = () => {
  // State to track the current date range
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [templates, setTemplates] = useState([
    { id: 1, title: 'Standard Day', description: '9 AM - 5 PM, 30 min slots' },
    { id: 2, title: 'Morning Only', description: '8 AM - 12 PM, 20 min slots' },
    { id: 3, title: 'Afternoon Only', description: '1 PM - 5 PM, 45 min slots' }
  ]);
  
  // Example slots data structure
  const [slotsData, setSlotsData] = useState({});

  // Calculate week dates on component mount or when current date changes
  useEffect(() => {
    generateWeekDates();
    generateSampleSlots();
  }, [currentDate]);

  // Function to generate week dates based on current date
  const generateWeekDates = () => {
    const dates = [];
    const startDate = new Date(currentDate);
    
    // Set to the start of the week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    
    setWeekDates(dates);
  };

  // Generate sample slots data
  const generateSampleSlots = () => {
    const newSlotsData = {};
    
    weekDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      
      // Create 3-5 random slots for each day
      const numSlots = Math.floor(Math.random() * 3) + 3;
      const daySlots = [];
      
      for (let i = 0; i < numSlots; i++) {
        const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
        const minute = [0, 30][Math.floor(Math.random() * 2)]; // 0 or 30 minutes
        const statusOptions = ['available', 'booked', 'blocked'];
        const status = statusOptions[Math.floor(Math.random() * 3)];
        
        daySlots.push({
          id: `${dateStr}-${i}`,
          time: `${hour}:${minute.toString().padStart(2, '0')}`,
          duration: 30,
          status
        });
      }
      
      // Sort slots by time
      daySlots.sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
      
      newSlotsData[dateStr] = daySlots;
    });
    
    setSlotsData(newSlotsData);
  };

  // Handle previous week navigation
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Handle next week navigation
  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Handle today navigation
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Open the slot modal for adding or editing
  const handleOpenSlotModal = (date, slot = null) => {
    setCurrentSlot({
      date,
      ...slot
    });
    setModalOpen(true);
  };

  // Close the slot modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentSlot(null);
  };

  // Save the slot
  const handleSaveSlot = () => {
    // Logic to save the slot would go here
    // This would update the slotsData state

    // For demonstration, just close the modal
    handleCloseModal();
  };

  // Format date for display (e.g., "Mar 6")
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get day name (e.g., "Monday")
  const getDayName = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long'
    }).format(date);
  };

  // Format date range for the header
  const formatDateRange = () => {
    if (weekDates.length === 0) return '';
    
    const startDate = formatDate(weekDates[0]);
    const endDate = formatDate(weekDates[6]);
    
    return `${startDate} - ${endDate}`;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="slots-container">
      <div className="slots-header">
        <h1>Manage Appointment Slots</h1>
        <div className="slots-actions">
          <button className="template-btn">
            <span className="icon">📋</span>
            Templates
          </button>
          <button className="generate-btn">
            <span className="icon">✨</span>
            Auto Generate
          </button>
        </div>
      </div>

      <div className="slots-content">
        <div className="date-navigator">
          <div className="date-range">{formatDateRange()}</div>
          <div className="navigator-buttons">
            <button className="navigator-btn" onClick={handleToday}>Today</button>
            <button className="navigator-btn" onClick={handlePrevWeek}>
              <span className="icon">◀</span> Previous
            </button>
            <button className="navigator-btn" onClick={handleNextWeek}>
              Next <span className="icon">▶</span>
            </button>
          </div>
        </div>

        <div className="calendar-view">
          {weekDates.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const slots = slotsData[dateStr] || [];
            
            return (
              <div className={`day-column ${isToday(date) ? 'today' : ''}`} key={index}>
                <div className="day-header">
                  <div className="day-name">{getDayName(date)}</div>
                  <div className="day-date">{formatDate(date)}</div>
                </div>
                <div className="day-slots">
                  {slots.map(slot => (
                    <div className="slot-item" key={slot.id}>
                      <div className="slot-time">{slot.time}</div>
                      <div className={`slot-status status-${slot.status}`}>
                        {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                      </div>
                      <div className="slot-actions">
                        <button className="slot-btn edit-btn" title="Edit" onClick={() => handleOpenSlotModal(dateStr, slot)}>✎</button>
                        {slot.status !== 'booked' && (
                          <button className="slot-btn block-btn" title={slot.status === 'blocked' ? 'Unblock' : 'Block'}>
                            {slot.status === 'blocked' ? '✓' : '✕'}
                          </button>
                        )}
                        <button className="slot-btn delete-btn" title="Delete">🗑</button>
                      </div>
                    </div>
                  ))}
                  <button className="add-slot-btn" onClick={() => handleOpenSlotModal(dateStr)}>
                    <span className="icon">+</span> Add Slot
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="template-section">
          <h2>Your Templates</h2>
          <div className="template-list">
            {templates.map(template => (
              <div className="template-item" key={template.id}>
                <div className="template-title">{template.title}</div>
                <div className="template-description">{template.description}</div>
                <div className="template-actions">
                  <button className="slot-btn edit-btn" title="Edit Template">✎</button>
                  <button className="slot-btn delete-btn" title="Delete Template">🗑</button>
                </div>
              </div>
            ))}
          </div>
          <button className="create-template-btn">
            <span className="icon">+</span> Create New Template
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="slot-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentSlot && currentSlot.id ? 'Edit Slot' : 'Add New Slot'}
              </h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={currentSlot ? currentSlot.date : ''}
                readOnly
                className="form-control"
              />
            </div>

            <div className="time-inputs">
              <div className="form-group time-input">
                <label>Start Time</label>
                <input
                  type="time"
                  defaultValue={currentSlot && currentSlot.time ? currentSlot.time : '09:00'}
                  className="form-control"
                />
              </div>
              <div className="form-group time-input">
                <label>End Time</label>
                <input
                  type="time"
                  defaultValue="09:30"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <div className="duration-input">
                <input
                  type="number"
                  min="5"
                  step="5"
                  defaultValue={currentSlot && currentSlot.duration ? currentSlot.duration : 30}
                  className="form-control"
                />
                <span>minutes</span>
              </div>
            </div>

            <div className="form-group">
              <label>Slot Type</label>
              <div className="slot-type-options">
                <div className="slot-type-option selected">
                  <span className="slot-type-icon">👨‍⚕️</span>
                  <span className="slot-type-label">In-Person</span>
                </div>
                <div className="slot-type-option">
                  <span className="slot-type-icon">💻</span>
                  <span className="slot-type-label">Video Call</span>
                </div>
                <div className="slot-type-option">
                  <span className="slot-type-icon">📞</span>
                  <span className="slot-type-label">Phone Call</span>
                </div>
              </div>
            </div>

            <div className="repeat-options">
              <div className="repeat-header">
                <input type="checkbox" id="repeat-slots" />
                <label htmlFor="repeat-slots">Repeat this slot</label>
              </div>
              
              <div className="form-group">
                <label>Repeat on</label>
                <div className="days-selection">
                  <div className="day-button">S</div>
                  <div className="day-button">M</div>
                  <div className="day-button selected">T</div>
                  <div className="day-button">W</div>
                  <div className="day-button selected">T</div>
                  <div className="day-button">F</div>
                  <div className="day-button">S</div>
                </div>
              </div>
              
              <div className="form-group">
                <label>End date</label>
                <div className="end-date">
                  <input type="date" className="form-control" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
              <button className="save-btn" onClick={handleSaveSlot}>
                {currentSlot && currentSlot.id ? 'Update Slot' : 'Add Slot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSlots;