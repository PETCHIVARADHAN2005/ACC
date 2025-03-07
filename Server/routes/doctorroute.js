import express from 'express';
import { addExperience, addQualification, addRegistration, addSpecialization, deleteExperience, deleteQualification, deleteSpecialization, getDoctorProfile, loginDoctor, updateExperience, updatePersonal, updateQualification, updateRegistration, updateSpecialization } from '../Controllers/doctorcontroller.js'; 
import authdoctor from '../Middlewares/authDoctor.js';
import upload from '../Middlewares/multer.js';
const doctorrouter=express.Router();
doctorrouter.put('/update-personal',upload.single('image'),authdoctor,updatePersonal);
doctorrouter.post('/login-doctor',loginDoctor);
doctorrouter.get('/profile',authdoctor,getDoctorProfile);
doctorrouter.post('/add-experience', authdoctor, addExperience);
doctorrouter.put('/update-experience', authdoctor, updateExperience);
doctorrouter.delete('/delete-experience/:experienceId', authdoctor, deleteExperience);
doctorrouter.post('/add-registration', authdoctor, addRegistration);
doctorrouter.put('/update-registration', authdoctor, updateRegistration);
doctorrouter.post('/add-qualification', authdoctor, addQualification);
doctorrouter.put('/update-qualification', authdoctor, updateQualification);
doctorrouter.delete('/delete-qualification/:qualificationId', authdoctor, deleteQualification);
doctorrouter.post('/add-specialization', authdoctor, addSpecialization);
doctorrouter.put('/update-specialization', authdoctor, updateSpecialization);
doctorrouter.delete('/delete-specialization/:specializationId', authdoctor, deleteSpecialization)


export default doctorrouter;
