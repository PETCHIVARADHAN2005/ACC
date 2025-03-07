import React from 'react'
import {Routes,Route} from 'react-router-dom'
import DoctorProfile from './Pages/Doctor/DoctorProfile'
import DoctorLogin from './Pages/Doctor/DoctoLogin'
import DoctorHome from './Pages/Doctor/DoctorHome'
import DoctorAppointment from './Pages/Doctor/DoctorAppointment'
import PatientRecord from './Pages/Doctor/PatientRecord'
import DoctorSlots from './Pages/Doctor/DoctorSlots'
import DoctorContextProvider, { DoctorContext } from './context/Doctorcontext'
// import './App.css';
// import AddDoctor from './Pages/Admin/AddDoctor';
// import AdminPage from './Pages/Admin/AdminPage';

const App = () => {
  return (
    <div>
      <DoctorContextProvider>
      <Routes>
        <Route path='/doctor-profile' element={<DoctorProfile/>}/>
        <Route path='/' element={<DoctorLogin/>}/>
        <Route path='/Home' element={<DoctorHome/>}/>
        <Route path='/appointments' element={<DoctorAppointment/>}/>
        <Route path='/patients-record' element={<PatientRecord/>}/>
        <Route path='/doctor-slots' element={<DoctorSlots/>}/>
      </Routes>
      </DoctorContextProvider>
      
    </div>
  )
}

export default App