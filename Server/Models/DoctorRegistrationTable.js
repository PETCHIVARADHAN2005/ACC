
import connection from '../config/mysql.js';

const createRegistrationTable = () => {
  const query = `
      CREATE TABLE IF NOT EXISTS DoctorRegistration (
  registration_id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id VARCHAR(255) NOT NULL,
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  medical_council VARCHAR(100) NOT NULL,
  registration_year INT NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  updated_at TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
)
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Registration table:', err);
      return;
    }
    console.log('Registration table created successfully');
  });
};

export default createRegistrationTable;