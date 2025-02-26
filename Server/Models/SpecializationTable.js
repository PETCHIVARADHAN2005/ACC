
import connection from '../config/mysql.js';

const createSpecializationTable = () => {
  const query = `
      CREATE TABLE IF NOT EXISTS DoctorSpecializations (
  specialization_id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id VARCHAR(255) NOT NULL,
  specialization_name VARCHAR(100) NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  updated_at TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
)
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Specialization table:', err);
      return;
    }
    console.log('Specialization table created successfully');
  });
};

export default createSpecializationTable;