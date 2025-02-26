
import connection from '../config/mysql.js';

const createQualificationTable = () => {
  const query = `
      CREATE TABLE IF NOT EXISTS DoctorQualifications (
  qualification_id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id VARCHAR(255) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  university VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  updated_at TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
)
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Qualification table:', err);
      return;
    }
    console.log('Qualification table created successfully');
  });
};

export default createQualificationTable;