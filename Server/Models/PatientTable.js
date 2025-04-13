import connection from '../config/mysql.js';

const createPatientTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Patient (
      patient_id VARCHAR(255) PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE,
      phone_number VARCHAR(20) NOT NULL,
      gender VARCHAR(20),
      dob DATE,
      blood_group VARCHAR(5),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    )
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Patient table:', err);
      return;
    }
    console.log('Patient table created successfully');
  });
};

export default createPatientTable;