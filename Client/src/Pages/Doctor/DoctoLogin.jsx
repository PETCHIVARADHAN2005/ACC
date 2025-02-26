import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/Doctorcontext.jsx';
import '../../styles/DoctorLogin.css';

const DoctorLogin = () => {

  const { backendUrl, token, setToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctor_id: '',
    password: ''
  });
  const [error, setError] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl+'/api/doctor/login-doctor', formData);
       
      if (response.data.success) {
        localStorage.setItem('doctor-token', response.data.token);
        setToken(response.data.token);
        
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  useEffect(() => {
    if (token) {
        navigate('/Home');
    }
}, [token]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Doctor Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-container">
              <input
                type="text"
                name="doctor_id"
                placeholder="Doctor ID"
                value={formData.doctor_id}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;
