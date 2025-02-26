import express from 'express';
import { getDoctorProfile, loginDoctor, updateDoctor, upload } from '../Controllers/doctorcontroller.js'; 
import authdoctor from '../Middlewares/authDoctor.js';
const doctorrouter=express.Router();
doctorrouter.put('/update-doctor',authdoctor,upload,updateDoctor);
doctorrouter.post('/login-doctor',loginDoctor);
doctorrouter.get('/profile',authdoctor,getDoctorProfile);
export default doctorrouter;
