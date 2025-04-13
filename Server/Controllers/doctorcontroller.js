import connection from "../config/mysql.js";
import  {cloudinary} from "../config/cloudinary.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const updatePersonal = async (req, res) => {
  console.log("Update end point called");

  try {
    console.log("Request body:", req.file);

    let imageUrl = null;
    
    // Only process image if a new file is uploaded
    if (req.file) {
      // Upload image to Cloudinary if file exists
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        timeout: 60000
      });
      imageUrl = result.secure_url; // Assign Cloudinary URL to imageUrl
    } else {
      // If no new image is uploaded, we need to get the existing image URL
      // First, query the database to get the current profile_image
      const getCurrentImageQuery = "SELECT profile_image FROM Doctor WHERE doctor_id = ?";
      const [currentImageResult] = await new Promise((resolve, reject) => {
        connection.query(getCurrentImageQuery, [req.body.doctor_id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
      
      // Use the existing image URL
      if (currentImageResult && currentImageResult.profile_image) {
        imageUrl = currentImageResult.profile_image;
      }
    }

    console.log("Image URL:", imageUrl);

    const dob1 = new Date(req.body.dob);

    const {
      first_name,
      last_name,
      gender,
      dob,
      blood_group,
      aadhar_number,
      phone_number,
      emergency_phone,
      personal_email,
      emergency_email,
      permanent_address_country,
      permanent_address_state,
      permanent_address_district,
      permanent_address_pincode,
      permanent_address_line,
      current_address_country,
      current_address_state,
      current_address_district,
      current_address_pincode,
      current_address_line,
    } = req.body;

    const doctor_id = req.body.doctor_id;

    const query = `
    UPDATE Doctor
    SET
    first_name = ?,
    last_name = ?,
    gender = ?,
    dob = ?,
    profile_image = ?,
    blood_group = ?,
    aadhar_number = ?,
    phone_number = ?,
    emergency_phone = ?,
    personal_email = ?,
    emergency_email = ?,
    permanent_address_country = ?,
    permanent_address_state = ?,
    permanent_address_district =?,
    permanent_address_pincode = ?,
    permanent_address_line = ?,
    current_address_country = ?,
    current_address_state = ?,
    current_address_district = ?,
    current_address_pincode = ?,
    current_address_line = ?
    WHERE doctor_id = ?
    `;

    connection.query(query, [
      first_name,
      last_name,
      gender,
      dob1,
      imageUrl, // This will now be either the new image URL or the existing one
      blood_group,
      aadhar_number,
      phone_number,
      emergency_phone,
      personal_email,
      emergency_email,
      permanent_address_country,
      permanent_address_state,
      permanent_address_district,
      permanent_address_pincode,
      permanent_address_line,
      current_address_country,
      current_address_state,
      current_address_district,
      current_address_pincode,
      current_address_line,
      doctor_id
    ], (err, results) => {
      if (err) {
        console.log("failed 1", err);
        return res.status(500).json({
          success: false,
          error: "Failed to update personal details"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Personal details updated successfully",
        imageUrl: imageUrl
      });
    });
  } catch (error) {
    console.log("failed 2:", error);
    return res.status(500).json({
      success: false,
      error: "Update operation failed: " + error.message
    });
  }
}



// For Qualifications
const addQualification = (req, res) => {
  console.log("add qualification",req.body);
  const {degree, university, year} = req.body;
  const doctor_id = req.body.doctor_id;
  const query = `INSERT INTO DoctorQualifications(doctor_id, degree, university, year) VALUES(?,?,?,?)`;
  connection.query(query, [doctor_id, degree, university, year], handleResponse(res, "Qualification added"));
};

const updateQualification = (req, res) => {
  console.log("update qualification");
  const {qualification_id, degree, university, year} = req.body;
  const doctor_id = req.body.doctor_id;
  const query = `UPDATE DoctorQualifications SET degree=?, university=?, year=? WHERE qualification_id=? AND doctor_id=?`;
  connection.query(query, [degree, university, year, qualification_id, doctor_id], handleResponse(res, "Qualification updated"));
};

const deleteQualification = (req, res) => {
  console.log("delete qualification",req.body);
  const qualification_id = req.params.qualificationId;
  console.log(qualification_id);
  const doctor_id = req.body.doctor_id;
  const query = `DELETE FROM DoctorQualifications WHERE qualification_id=? AND doctor_id=?`;
  connection.query(query, [qualification_id, doctor_id], handleResponse(res, "Qualification deleted"));
};
// For Specializations
const addSpecialization = (req, res) => {
  console.log("add specialization");
  const {specialization_name} = req.body;
  const doctor_id = req.body.doctor_id;
  const query = `INSERT INTO DoctorSpecializations(doctor_id, specialization_name) VALUES(?,?)`;
  connection.query(query, [doctor_id, specialization_name], handleResponse(res, "Specialization added"));
};

const updateSpecialization = (req, res) => {
  console.log("update specialization");
  const {specialization_id, specialization_name} = req.body;
  const doctor_id = req.body.doictor_id;
  const query = `UPDATE DoctorSpecializations SET specialization_name=? WHERE specialization_id=? AND doctor_id=?`;
  connection.query(query, [specialization_name, specialization_id, doctor_id], handleResponse(res, "Specialization updated"));
};
const deleteSpecialization = (req, res) => {
  console.log("delete specialization");
  const specialization_id = req.params.specializationId;
  const doctor_id = req.body.doctor_id;
  const query = `DELETE FROM DoctorSpecializations WHERE specialization_id=? AND doctor_id=?`;
  connection.query(query, [specialization_id, doctor_id], handleResponse(res, "Specialization deleted"));
};
// For Experience
const addExperience = (req, res) => {
  console.log("add experience");
  const {institution, position, start_year, end_year} = req.body;
  const doctor_id = req.body.doctor_id;
  const query = `INSERT INTO DoctorExperiences(doctor_id, institution, position, start_year, end_year) VALUES(?,?,?,?,?)`;
  connection.query(query, [doctor_id, institution, position, start_year, end_year], handleResponse(res, "Experience added"));
};

const updateExperience = (req, res) => {
  console.log("update experience");
  const {experience_id, institution, position, start_year, end_year} = req.body;
  const doctor_id = req.body.doctor_id;
  const query = `UPDATE DoctorExperiences SET institution=?, position=?, start_year=?, end_year=? WHERE experience_id=? AND doctor_id=?`;
  connection.query(query, [institution, position, start_year, end_year, experience_id, doctor_id], handleResponse(res, "Experience updated"));
};
const deleteExperience = (req, res) => {
  console.log("delete experience");
  const experience_id = req.params.experienceId;
  const doctor_id = req.body.doctor_id;
  const query = `DELETE FROM DoctorExperiences WHERE experience_id=? AND doctor_id=?`;
  connection.query(query, [experience_id, doctor_id], handleResponse(res, "Experience deleted"));
};

// For Registration
const addRegistration = (req, res) => {
  console.log("For add registeration",req.body);
  const {registration_number, medical_council, registration_year} = req.body.registration;
  console.log(req.body.registration.registration_number);
  const doctor_id = req.body.doctor_id;
  const query = `INSERT INTO DoctorRegistration(doctor_id, registration_number, medical_council, registration_year) VALUES(?,?,?,?)`;
  connection.query(query, [doctor_id, registration_number, medical_council, registration_year], handleResponse(res, "Registration added"));
};

const updateRegistration = (req, res) => {
  console.log("For updation",req.body);
  const { registration_number, medical_council, registration_year} = req.body.registration;
  const doctor_id = req.body.doctor_id;
  const query = `UPDATE DoctorRegistration SET registration_number=?, medical_council=?, registration_year=? WHERE doctor_id=?`;
  connection.query(query, [registration_number, medical_council, registration_year,  doctor_id], handleResponse(res, "Registration updated"));
};

// Helper function to reduce code duplication
const handleResponse = (res, successMessage) => {
  return (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        error: `Failed to ${successMessage.toLowerCase()}`
      });
    }
    return res.status(200).json({
      success: true,
      message: `${successMessage} successfully`
    });
  };
};

const loginDoctor = (req, res) => {
  try {
    const { doctor_id, password } = req.body;
    console.log("Received login request for doctor:", doctor_id);

    const query = `
          SELECT d.*, a.password 
          FROM Doctor d 
          JOIN Auth a ON d.doctor_id = a.doctor_id 
          WHERE d.doctor_id = ? AND a.password = ?
      `;

    connection.query(query, [doctor_id, password], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Login failed",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      const doctor = results[0];
      const token = jwt.sign(
        { doctor_id: doctor.doctor_id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      console.log("Generated token:", token);
      res.status(200).json({
        success: true,
        token,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor_id = req.body.doctor_id;
    console.log("Received request for doctor profile with ID:", doctor_id);

    // Using Promise-based queries with proper await
    const [doctorResult] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM Doctor WHERE doctor_id = ?`,
        [doctor_id],
        (err, results) => {
          if (err) reject(err);
          resolve([results]);
        }
      );
    });

    if (!doctorResult || doctorResult.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get qualifications
    const [qualifications] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM DoctorQualifications WHERE doctor_id = ?`,
        [doctor_id],
        (err, results) => {
          if (err) reject(err);
          resolve([results]);
        }
      );
    });

    // Get specializations
    const [specializations] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM DoctorSpecializations WHERE doctor_id = ?`,
        [doctor_id],
        (err, results) => {
          if (err) reject(err);
          resolve([results]);
        }
      );
    });

    // Get experiences
    const [experiences] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM DoctorExperiences WHERE doctor_id = ?`,
        [doctor_id],
        (err, results) => {
          if (err) reject(err);
          resolve([results]);
        }
      );
    });

    // Get registration details
    const [registration] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM DoctorRegistration WHERE doctor_id = ?`,
        [doctor_id],
        (err, results) => {
          if (err) reject(err);
          resolve([results]);
        }
      );
    });

    const doctorProfile = {
      personal: doctorResult[0],
      qualifications: qualifications || [],
      specializations: specializations || [],
      experiences: experiences || [],
      registration:
        registration && registration.length > 0 ? registration[0] : {},
    };

    res.status(200).json(doctorProfile);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new slot
const addSlot = (req, res) => {
  console.log("Add slot endpoint called", req.body);
  const { doctor_id, slot_date, start_time, end_time } = req.body;

  // Validate date (today to 10 days from now)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 10);
  const slotDate = new Date(slot_date);

  if (slotDate < today || slotDate > maxDate) {
    return res.status(400).json({
      success: false,
      error: "Slot date must be between today and 10 days from now"
    });
  }

  const query = `
    INSERT INTO DoctorSlots (doctor_id, slot_date, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [doctor_id, slot_date, start_time, end_time], handleResponse(res, "Slot added"));
};

// Edit an existing slot
const updateSlot = (req, res) => {
  console.log("Update slot endpoint called", req.body);
  const { slot_date, start_time, end_time } = req.body;
  const slot_id = req.params.slotId;
  console.log("Received slot_id:", slot_id);
  // Validate date (today to 10 days from now)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 10);
  const slotDate = new Date(slot_date);

  if (slotDate < today || slotDate > maxDate) {
    return res.status(400).json({
      success: false,
      error: "Slot date must be between today and 10 days from now"
    });
  }

  const query = `
    UPDATE DoctorSlots 
    SET slot_date = ?, start_time = ?, end_time = ?, updated_at = NOW()
    WHERE slot_id = ?
  `;
  connection.query(query, [slot_date, start_time, end_time, slot_id], handleResponse(res, "Slot updated"));
};

const deleteSlot = (req, res) => {
  console.log("Delete slot endpoint called", req.params);
  const slot_id = req.params.slotId;
  
  // Check if slot_id is provided
  if (!slot_id) {
    return res.status(400).json({
      success: false,
      error: "Slot ID is required"
    });
  }

  const query = `
    DELETE FROM DoctorSlots 
    WHERE slot_id = ?
  `;
  
  connection.query(query, [slot_id], (err, result) => {
    if (err) {
      console.error("Error deleting slot:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to delete slot",
        details: err.message
      });
    }
    
    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "No slot found with the provided ID"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
      affectedRows: result.affectedRows
    });
  });
};


// Get all slots for a doctor (for completeness, aligns with frontend)
const getSlotsByDoctor = (req, res) => {
  console.log("Get slots endpoint called", req.body);
  const doctor_id = req.body.doctor_id;

  const query = `
    SELECT * FROM DoctorSlots 
    WHERE doctor_id = ? AND slot_date >= CURDATE() 
    ORDER BY slot_date, start_time
  `;
  connection.query(query, [doctor_id], (err, results) => {
    if (err) {
      console.error("Error fetching slots:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch slots"
      });
    }
    return res.status(200).json(results);
  });
};
// Get all patients for the logged-in doctor 😊
const getDoctorPatients = async (req, res) => {
  try {
    // Get doctor_id from authenticated user
    const doctor_id = req.doctor_id || req.body.doctor_id;
    console.log("Fetching patients for doctor:", doctor_id);
    
    // Query to get all patients who have appointments with this doctor
    const query = `
      SELECT DISTINCT p.*, 
        MAX(CASE WHEN a.appointment_date < CURDATE() THEN a.appointment_date END) as last_appointment,
        MIN(CASE WHEN a.appointment_date >= CURDATE() THEN a.appointment_date END) as next_appointment
      FROM Patient p
      JOIN Appointment a ON p.patient_id = a.patient_id
      WHERE a.doctor_id = ?
      GROUP BY p.patient_id
      ORDER BY next_appointment ASC, last_appointment DESC
    `;
    
    const [patients] = await new Promise((resolve, reject) => {
      connection.query(query, [doctor_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    console.log(`Found ${patients.length} patients for doctor ${doctor_id}`);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({ message: 'Failed to fetch patients' });
  }
};

const getPatientDetails = async (req, res) => {
  try {
    const doctor_id = req.doctor_id || req.body.doctor_id;
    const patient_id = req.params.patient_id;
    
    console.log(`Fetching details for patient ${patient_id} for doctor ${doctor_id}`);
    
    // First verify this patient has appointments with this doctor
    const verifyQuery = `
      SELECT COUNT(*) as count 
      FROM Appointment 
      WHERE doctor_id = ? AND patient_id = ?
    `;
    
    const [verification] = await new Promise((resolve, reject) => {
      connection.query(verifyQuery, [doctor_id, patient_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    if (!verification[0] || verification[0].count === 0) {
      return res.status(403).json({ message: 'You do not have access to this patient' });
    }
    
    // Get patient details
    const patientQuery = `SELECT * FROM Patient WHERE patient_id = ?`;
    
    const [patient] = await new Promise((resolve, reject) => {
      connection.query(patientQuery, [patient_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get patient appointments with this doctor
    const appointmentsQuery = `
      SELECT * FROM Appointment
      WHERE doctor_id = ? AND patient_id = ?
      ORDER BY appointment_date DESC, start_time DESC
    `;
    
    const [appointments] = await new Promise((resolve, reject) => {
      connection.query(appointmentsQuery, [doctor_id, patient_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    // Combine patient details with appointments
    const patientWithAppointments = {
      ...patient[0],
      appointments: appointments
    };
    
    console.log(`Successfully fetched details for patient ${patient_id}`);
    res.status(200).json(patientWithAppointments);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ message: 'Failed to fetch patient details' });
  }
};
const getDoctorDashboard = async (req, res) => {
  try {
    // Get doctor_id from authenticated user
    const doctor_id = req.doctor_id || req.body.doctor_id;
    console.log("Fetching dashboard data for doctor:", doctor_id);
    
    // Get doctor's name
    const doctorNameQuery = `
      SELECT first_name, last_name
      FROM Doctor
      WHERE doctor_id = ?
    `;
    
    // Get total patients count
    const patientsCountQuery = `
      SELECT COUNT(DISTINCT patient_id) as total_patients
      FROM Appointment
      WHERE doctor_id = ?
    `;
    
    // Get total appointments count
    const appointmentsCountQuery = `
      SELECT COUNT(*) as total_appointments
      FROM Appointment
      WHERE doctor_id = ?
    `;
    
    // Get today's appointments
    const todayAppointmentsQuery = `
      SELECT a.*, p.first_name, p.last_name, p.phone_number
      FROM Appointment a
      JOIN Patient p ON a.patient_id = p.patient_id
      WHERE a.doctor_id = ? AND a.appointment_date = CURDATE()
      ORDER BY a.start_time ASC
    `;
    
    // Get recent 5 appointments
    const recentAppointmentsQuery = `
      SELECT a.*, p.first_name, p.last_name, p.phone_number
      FROM Appointment a
      JOIN Patient p ON a.patient_id = p.patient_id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC, a.start_time DESC
      LIMIT 5
    `;
    
    // Execute all queries
    const [doctorInfo] = await new Promise((resolve, reject) => {
      connection.query(doctorNameQuery, [doctor_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    const [patientsCount] = await new Promise((resolve, reject) => {
      connection.query(patientsCountQuery, [doctor_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    const [appointmentsCount] = await new Promise((resolve, reject) => {
      connection.query(appointmentsCountQuery, [doctor_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    const [todayAppointments] = await new Promise((resolve, reject) => {
      connection.query(todayAppointmentsQuery, [doctor_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    const [recentAppointments] = await new Promise((resolve, reject) => {
      connection.query(recentAppointmentsQuery, [doctor_id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });
    
    // Combine all data
    const dashboardData = {
      doctor_name: doctorInfo[0] ? `${doctorInfo[0].first_name} ${doctorInfo[0].last_name}` : '',
      total_patients: patientsCount[0]?.total_patients || 0,
      total_appointments: appointmentsCount[0]?.total_appointments || 0,
      today_appointments: todayAppointments || [],
      recent_appointments: recentAppointments || []
    };
    
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching doctor dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};



export { loginDoctor, getDoctorProfile, addQualification, updateQualification, addSpecialization, updateSpecialization, addExperience, updateExperience, addRegistration, updateRegistration,updatePersonal,deleteExperience,deleteQualification,deleteSpecialization,addSlot,deleteSlot,updateSlot,getSlotsByDoctor,getDoctorPatients,getPatientDetails,getDoctorDashboard};
