import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/Doctorcontext';
import axios from 'axios';
import '../../styles/DoctorSlots.css';

const DoctorSlots = ({ doctorId }) => {
  const { backendUrl, token } = useContext(DoctorContext);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    slot_date: '',
    start_time: '',
    end_time: ''
  });
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [error, setError] = useState('');

  // Configure axios with auth header
  const axiosInstance = axios.create({
    baseURL: backendUrl,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  useEffect(() => {
    fetchSlots();
  }, [doctorId]);

  const fetchSlots = async () => {
    try {
      const response = await axiosInstance.get(`/api/doctor/get-slots`);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateSlot = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 10);
    const slotDate = new Date(formData.slot_date);

    if (slotDate < today || slotDate > maxDate) {
      setError('Date must be between today and 10 days from now');
      return false;
    }

    const start = new Date(`1970-01-01T${formData.start_time}`);
    const end = new Date(`1970-01-01T${formData.end_time}`);
    if (end <= start) {
      setError('End time must be after start time');
      return false;
    }

    return true;
  };
// Add this function after resetForm() and before the return statement
const highlightNewSlot = (slotId) => {
  setTimeout(() => {
    const element = document.querySelector(`tr[data-slot-id="${slotId}"]`);
    if (element) {
      element.classList.add('highlight-new');
    }
  }, 100);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSlot()) return;

    try {
      let response;
      const requestData = { ...formData, doctor_id: doctorId };

      if (editingSlotId) {
        // Update existing slot
        response = await axiosInstance.put(`/api/doctor/update-slot/${editingSlotId}`, requestData);
        if (!response.data.error) {
          highlightNewSlot(editingSlotId); // Highlight the updated slot
        }
      } else {
        // Create new slot
        response = await axiosInstance.post('/api/doctor/add-slot', requestData);
        if (!response.data.error && response.data.insertId) {
          highlightNewSlot(response.data.insertId); 
        }
      }
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        resetForm();
        fetchSlots();
      }
    } catch (error) {
      console.error('Error submitting slot:', error);
      setError(error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (slot) => {
    // Format the date to YYYY-MM-DD for the date input
    const formattedDate = new Date(slot.slot_date).toISOString().split('T')[0];
    
    setFormData({
      slot_date: formattedDate,
      start_time: slot.start_time,
      end_time: slot.end_time
    });
    setEditingSlotId(slot.slot_id);
    setError('');
  };

  const handleDelete = async (slot_id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    
    try {
      await axiosInstance.delete(`/api/doctor/delete-slot/${slot_id}`);
      fetchSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      setError(error.response?.data?.error || 'Failed to delete slot');
    }
  };

  const resetForm = () => {
    setFormData({ slot_date: '', start_time: '', end_time: '' });
    setEditingSlotId(null);
    setError('');
  };

  // Format date for display (keeping original format)
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="doctor-manage-slots">
      <h1>Manage Slots</h1>
      <form onSubmit={handleSubmit} className="doctor-slot-form">
        <input
          type="date"
          name="slot_date"
          value={formData.slot_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editingSlotId ? 'Update' : 'Add'} Slot</button>
        {editingSlotId && (
          <button type="button" className="doctor-cancel" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>
      
      {error && <p className="doctor-error">{error}</p>}
      
      <table className="doctor-slots-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.length === 0 ? (
            <tr>
              <td colSpan="4" style={{textAlign: 'center'}}>No slots available</td>
            </tr>
          ) : (
            slots.map((slot) => (
              <tr key={slot.slot_id} data-slot-id={slot.slot_id}>
                <td data-label="Date">{formatDate(slot.slot_date)}</td>
                <td data-label="From">{slot.start_time}</td>
                <td data-label="To">{slot.end_time}</td>
                <td data-label="Actions">
                  <button className="doctor-edit" onClick={() => handleEdit(slot)}>Edit</button>
                  <button className="doctor-delete" onClick={() => handleDelete(slot.slot_id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorSlots;
