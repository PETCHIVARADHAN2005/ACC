import connection from "../config/mysql.js";
import multer from "multer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

// const updateDoctor = async (req, res) => {
//     console.log("updatedoctor called");
//     const doctor_id = req.doctor_id;
//   const { personal, qualifications, specializations, experiences, registration } = req.body;
//   const profileImage = req.file;
// //   console.log("doctor_id",doctor_id);
// //   console.log("profileImage",profileImage);
// //   console.log('Request body:', req.body);
// //     console.log('File:', req.file);

//   try {
//       connection.beginTransaction((err) => {
//           if (err) throw err;

//           // 1. Update personal info with image

//           const personalData = personal ? JSON.parse(personal):{};
//           if (profileImage) {
//               personalData.profile_image = profileImage.filename;
//           }
//           console.log(personalData);
//         //   personalData.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
//           connection.query(
//               'UPDATE Doctor SET ? WHERE doctor_id = ?',
//               [personalData, doctor_id],
//               (err) => {
//                   if (err) {
//                       return connection.rollback(() => {
//                           throw err;
//                       });
//                   }

//                   // 2. Update qualifications

//                   if (qualifications) {
//                       const qualificationsData = qualifications ? JSON.parse(qualifications):{};

//                       connection.query('DELETE FROM DoctorQualifications WHERE doctor_id = ?', [doctor_id], (err) => {
//                           if (err) {
//                               return connection.rollback(() => {
//                                   throw err;
//                               });
//                           }

//                           const qualificationValues = qualificationsData.map(qual =>
//                               [doctor_id, qual.qualification, qual.institution, qual.completion_year]
//                           );

//                           connection.query(
//                               'INSERT INTO DoctorQualifications (doctor_id, qualification, institution, completion_year) VALUES ?',
//                               [qualificationValues]
//                           );
//                       });
//                   }

//                   // 3. Update specializations
//                   if (specializations) {
//                       const specializationsData = specializations? JSON.parse(specializations):{};
//                       connection.query('DELETE FROM DoctorSpecializations WHERE doctor_id = ?', [doctor_id], (err) => {
//                           if (err) {
//                               return connection.rollback(() => {
//                                   throw err;
//                               });
//                           }

//                           const specializationValues = specializationsData.map(spec =>
//                               [doctor_id, spec.specialization_name]
//                           );

//                           connection.query(
//                               'INSERT INTO DoctorSpecializations (doctor_id, specialization_name) VALUES ?',
//                               [specializationValues]
//                           );
//                       });
//                   }

//                   // 4. Update experiences
//                   if (experiences) {
//                       const experiencesData = experiences ? JSON.parse(experiences):{};
//                       connection.query('DELETE FROM DoctorExperiences WHERE doctor_id = ?', [doctor_id], (err) => {
//                           if (err) {
//                               return connection.rollback(() => {
//                                   throw err;
//                               });
//                           }

//                           const experienceValues = experiencesData.map(exp =>
//                               [doctor_id, exp.institution, exp.position, exp.start_year, exp.end_year]
//                           );

//                           connection.query(
//                               'INSERT INTO DoctorExperiences (doctor_id, institution, position, start_year, end_year) VALUES ?',
//                               [experienceValues]
//                           );
//                       });
//                   }

//                   // 5. Update registration
//                   if (registration) {
//                       const registrationData = registration ? JSON.parse(registration):{};
//                       connection.query(
//                           `INSERT INTO DoctorRegistration
//                           (doctor_id, registration_number, medical_council, registration_year)
//                           VALUES (?, ?, ?, ?)
//                           ON DUPLICATE KEY UPDATE
//                           registration_number = VALUES(registration_number),
//                           medical_council = VALUES(medical_council),
//                           registration_year = VALUES(registration_year)`,
//                           [
//                               doctor_id,
//                               registrationData.registration_number,
//                               registrationData.medical_council,
//                               registrationData.registration_year
//                           ]
//                       );
//                   }

//                   connection.commit((err) => {
//                       if (err) {
//                           return connection.rollback(() => {
//                               throw err;
//                           });
//                       }
//                       res.json({
//                           success: true,
//                           message: 'Profile updated successfully'
//                       });
//                   });
//               }
//           );
//       });
//   } catch (error) {
//       console.error('Update error:', error);
//       res.status(500).json({
//           success: false,
//           message: 'Failed to update profile',
//           error: error.message
//       });
//   }
// };

const updateDoctor = async (req, res) => {
  const doctor_id = req.doctor_id;
  console.log(req.body);
  const {
    personal,
    qualifications,
    specializations,
    experiences,
    registration,
  } = req.body;
  const profileImage = req.file;

  try {
    connection.beginTransaction((err) => {
      if (err) throw err;

      // 1. Update personal info with image
      const updateDoctorQuery = `
        UPDATE Doctor 
        SET 
            first_name = ?,
            last_name = ?,
            gender = ?,
            dob = ?,
            blood_group = ?,
            aadhar_number = ?,
            phone_number = ?,
            emergency_phone = ?,
            personal_email = ?,
            emergency_email = ?,
            permanent_address_country = ?,
            permanent_address_state = ?,
            permanent_address_district = ?,
            permanent_address_pincode = ?,
            permanent_address_line = ?,
            current_address_country = ?,
            current_address_state = ?,
            current_address_district = ?,
            current_address_pincode = ?,
            current_address_line = ?,
            profile_image = ?,
            updated_at = NOW(),
            updated_by = ?
        WHERE doctor_id = ?`;

      const personalData = personal ? JSON.parse(personal) : {};
      if (personalData.dob) {
        personalData.dob = personalData.dob.split('T')[0];
      }

      const values = [
        personalData.first_name,
        personalData.last_name,
        personalData.gender,
        personalData.dob,
        personalData.blood_group,
        personalData.aadhar_number,
        personalData.phone_number,
        personalData.emergency_phone,
        personalData.personal_email,
        personalData.emergency_email,
        personalData.permanent_address_country,
        personalData.permanent_address_state,
        personalData.permanent_address_district,
        personalData.permanent_address_pincode,
        personalData.permanent_address_line,
        personalData.current_address_country,
        personalData.current_address_state,
        personalData.current_address_district,
        personalData.current_address_pincode,
        personalData.current_address_line,
        profileImage ? profileImage.filename : personalData.profile_image,
        doctor_id,
        doctor_id,
      ];

      connection.query(updateDoctorQuery, values, (err) => {
        if (err) {
          return connection.rollback(() => {
            throw err;
          });
        }

        // 2. Insert qualifications
        if (qualifications) {
          const qualificationsData = JSON.parse(qualifications);
          const qualificationQuery = `
            INSERT INTO DoctorQualifications 
            (doctor_id, degree, university, year, created_at, created_by, updated_at, updated_by) 
            VALUES ?`;

          const qualificationValues = qualificationsData.map((qual) => [
            doctor_id,
            qual.qualification,
            qual.institution,
            qual.completion_year,
            connection.raw('NOW()'),
            doctor_id,
            connection.raw('NOW()'),
            doctor_id
          ]);

          connection.query(qualificationQuery, [qualificationValues], (err) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }
          });
        }

        // 3. Insert specializations
        if (specializations) {
          const specializationsData = JSON.parse(specializations);
          const specializationQuery = `
            INSERT INTO DoctorSpecializations 
            (doctor_id, specialization_name, created_at, created_by, updated_at, updated_by)
            VALUES ?`;

          const specializationValues = specializationsData.map((spec) => [
            doctor_id,
            spec.specialization_name,
            connection.raw('NOW()'),
            doctor_id,
            connection.raw('NOW()'),
            doctor_id
          ]);

          connection.query(specializationQuery, [specializationValues], (err) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }
          });
        }

        // 4. Insert experiences
        if (experiences) {
          const experiencesData = JSON.parse(experiences);
          const experienceQuery = `
            INSERT INTO DoctorExperiences 
            (doctor_id, institution, position, start_year, end_year, created_at, created_by, updated_at, updated_by)
            VALUES ?`;

          const experienceValues = experiencesData.map((exp) => [
            doctor_id,
            exp.institution,
            exp.position,
            exp.start_year,
            exp.end_year,
            connection.raw('NOW()'),
            doctor_id,
            connection.raw('NOW()'),
            doctor_id
          ]);

          connection.query(experienceQuery, [experienceValues], (err) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }
          });
        }

        // 5. Insert registration
        if (registration) {
          const registrationData = JSON.parse(registration);
          const registrationQuery = `
            INSERT INTO DoctorRegistration 
            (doctor_id, registration_number, medical_council, registration_year, created_at, created_by, updated_at, updated_by)
            VALUES (?, ?, ?, ?, NOW(), ?, NOW(), ?)`;

          connection.query(registrationQuery, [
            doctor_id,
            registrationData.registration_number,
            registrationData.medical_council,
            registrationData.registration_year,
            doctor_id,
            doctor_id
          ], (err) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }
          });
        }

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }
          res.json({
            success: true,
            message: "Profile updated successfully"
          });
        });
      });
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
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

export { updateDoctor, upload, loginDoctor, getDoctorProfile };
