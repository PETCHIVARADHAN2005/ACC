import connection from "../config/mysql.js";
import  cloudinary from "../config/cloudinary.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();


const updatePersonal = async (req, res) => {
  console.log("Update end point called");
  try {
    let imageUrl = null;
    // if (req.file) {
    //   // Upload image to cloudinary if file exists
    //   const result = await cloudinary.uploader.upload(req.file.path,{resource_type:'image'});
    // }
      imageUrl = "data:image/png;base64,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";
      const dob1=new Date(req.body.dob);

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
      imageUrl, // Use the cloudinary URL
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
        console.log("failed 1",err);
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
    console.log("failed 2:",error);
    return res.status(500).json({
      success: false,
      error: "Image upload failed"
    });
  }
};
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
  const doctor_id = req.body.doctor_id;
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

export { loginDoctor, getDoctorProfile, addQualification, updateQualification, addSpecialization, updateSpecialization, addExperience, updateExperience, addRegistration, updateRegistration,updatePersonal,deleteExperience,deleteQualification,deleteSpecialization};
