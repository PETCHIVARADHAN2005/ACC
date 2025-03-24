import React, { useState } from 'react';
import { Users, Activity, Clipboard, Clock, FileText, Settings, Heart, AlertTriangle, Plus } from 'lucide-react';
import '../../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  // Sample data - replace with your actual data source
  const [patientStats, setPatientStats] = useState({
    totalPatients: 248,
    newPatientsThisMonth: 12,
    upcomingAppointments: 8,
    pendingReports: 5
  });

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, type: 'critical', patient: 'Emily Davis', message: 'Abnormal test results', time: '2 hours ago' },
    { id: 2, type: 'warning', patient: 'James Wilson', message: 'Missed follow-up appointment', time: '5 hours ago' },
    { id: 3, type: 'info', patient: 'Sarah Johnson', message: 'Prescription renewal', time: '1 day ago' }
  ]);

  const [keyMetrics, setKeyMetrics] = useState([
    { id: 1, name: 'Patient Satisfaction', value: '92%', trend: 'up' },
    { id: 2, name: 'Avg. Consultation Time', value: '18 min', trend: 'neutral' },
    { id: 3, name: 'Referral Rate', value: '15%', trend: 'up' },
    { id: 4, name: 'Follow-up Compliance', value: '78%', trend: 'down' }
  ]);

  // Task list with completed status
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review lab results - James Wilson', due: 'Due Today', completed: false },
    { id: 2, title: 'Complete medical report - Sarah Johnson', due: 'Due Tomorrow', completed: false },
    { id: 3, title: 'Follow-up call - Emily Davis', due: 'Due Mar 10', completed: false },
    { id: 4, title: 'Sign off on prescriptions', due: 'Due Mar 12', completed: false }
  ]);

  // State for new task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Function to handle task checkbox change
  const handleTaskCheck = (taskId) => {
    // Filter out the checked task
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Function to add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;
    
    const newTask = {
      id: Date.now(), // Use timestamp as a simple unique ID
      title: newTaskTitle,
      due: newTaskDue ? `Due ${newTaskDue}` : 'No due date',
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDue('');
    setShowTaskForm(false);
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <span className="trend-up">↑</span>;
    if (trend === 'down') return <span className="trend-down">↓</span>;
    return <span className="trend-neutral">→</span>;
  };

  return (
    <div className="dashboard-container">
      
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Patients</p>
            <p className="stat-value">{patientStats.totalPatients}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">New Patients</p>
            <p className="stat-value">{patientStats.newPatientsThisMonth} this month</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <Clipboard size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Upcoming Appointments</p>
            <p className="stat-value">{patientStats.upcomingAppointments}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Reports</p>
            <p className="stat-value">{patientStats.pendingReports}</p>
          </div>
        </div>
      </div>
      
      <div className="main-grid">
        {/* Quick Actions */}
        <div className="panel quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-grid">
            <button className="action-button action-blue">
              <Users size={24} className="action-icon" />
              <span className="action-label">Patient Records</span>
            </button>
            <button className="action-button action-green">
              <FileText size={24} className="action-icon" />
              <span className="action-label">Write Prescription</span>
            </button>
            <button className="action-button action-purple">
              <Clock size={24} className="action-icon" />
              <span className="action-label">Schedule Follow-up</span>
            </button>
            <button className="action-button action-amber">
              <Heart size={24} className="action-icon" />
              <span className="action-label">Health Metrics</span>
            </button>
          </div>
        </div>
      
        {/* Alerts & Notifications */}
        <div className="panel alerts-container">
          <h2 className="section-title">Recent Alerts</h2>
          <div className="alerts-list">
            {recentAlerts.map(alert => (
              <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                <div className={`alert-icon alert-icon-${alert.type}`}>
                  <AlertTriangle size={18} />
                </div>
                <div className="alert-content">
                  <p className="alert-patient">{alert.patient}</p>
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-time">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="panel metrics-container">
          <h2 className="section-title">Performance Metrics</h2>
          <div className="metrics-list">
            {keyMetrics.map(metric => (
              <div key={metric.id} className="metric-item">
                <span className="metric-label">{metric.name}</span>
                <div className="metric-value-container">
                  <span className="metric-value">{metric.value}</span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>
          <button className="button button-secondary view-details">
            View Detailed Analytics
          </button>
        </div>
      </div>
      
      {/* Recent Patients & Tasks */}
      <div className="bottom-grid">
        <div className="panel table-container">
          <div className="table-header">
            <h2 className="section-title">Recent Patients</h2>
            <button className="view-all">View All</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Smith</td>
                  <td>Mar 1, 2025</td>
                  <td><span className="status-badge status-stable">Stable</span></td>
                </tr>
                <tr>
                  <td>Sarah Johnson</td>
                  <td>Mar 3, 2025</td>
                  <td><span className="status-badge status-followup">Follow-up</span></td>
                </tr>
                <tr>
                  <td>Michael Brown</td>
                  <td>Mar 5, 2025</td>
                  <td><span className="status-badge status-critical">Critical</span></td>
                </tr>
                <tr>
                  <td>Emily Davis</td>
                  <td>Mar 7, 2025</td>
                  <td><span className="status-badge status-new">New</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="panel tasks-container">
          <div className="table-header">
            <h2 className="section-title">Pending Tasks</h2>
            <button 
              className="add-task-btn" 
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              <Plus size={16} />
              {showTaskForm ? 'Cancel' : 'Add Task'}
            </button>
          </div>
          
          {/* Add Task Form */}
          {showTaskForm && (
            <div className="add-task-form">
              <form onSubmit={handleAddTask}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Task description"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="task-input"
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Due date (e.g., Today, Tomorrow, Mar 15)"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="task-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="add-task-submit">Add Task</button>
                </div>
              </form>
            </div>
          )}
          
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <input 
                  type="checkbox" 
                  className="task-checkbox" 
                  onChange={() => handleTaskCheck(task.id)}
                />
                <div className="task-content">
                  <p className="task-title">{task.title}</p>
                  <p className="task-due">{task.due}</p>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="no-tasks-message">
                <p>Great job! All tasks are completed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;