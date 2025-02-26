

import connection from '../config/mysql.js';

const createExperienceTable = () => {
  const query = `
      CREATE TABLE IF NOT EXISTS DoctorExperiences (
  experience_id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  start_year INT NOT NULL,
  end_year INT,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  updated_at TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
)
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Experience table:', err);
      return;
    }
    console.log('Experience table created successfully');
  });
};

export default createExperienceTable;