import connection from '../config/mysql.js';

const createPatientMedicalHistoryTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS PatientMedicalHistory (
      history_id VARCHAR(255) PRIMARY KEY,
      patient_id VARCHAR(255) NOT NULL,
      \`condition\` VARCHAR(255) NOT NULL,
      diagnosis_date DATE NOT NULL,
      notes TEXT,
      medications TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
    )
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating PatientMedicalHistory table:', err);
      return;
    }
    console.log('PatientMedicalHistory table created successfully');
  });
};

export default createPatientMedicalHistoryTable;
