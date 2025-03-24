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

export { loginDoctor, getDoctorProfile, addQualification, updateQualification, addSpecialization, updateSpecialization, addExperience, updateExperience, addRegistration, updateRegistration,updatePersonal,deleteExperience,deleteQualification,deleteSpecialization};
