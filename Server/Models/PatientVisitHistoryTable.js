import connection from '../config/mysql.js';

const createPatientVisitsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS PatientVisits (
      visit_id VARCHAR(255) PRIMARY KEY,
      patient_id VARCHAR(255) NOT NULL,
      doctor_id VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      time VARCHAR(50),
      reason VARCHAR(255) NOT NULL,
      symptoms TEXT,
      diagnosis TEXT,
      prescription TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
    )
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating PatientVisits table:', err);
      return;
    }
    console.log('PatientVisits table created successfully');
  });
};

export default createPatientVisitsTable;
