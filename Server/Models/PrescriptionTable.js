import connection from '../config/mysql.js';

const createPrescriptionTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Prescription (
      prescription_id VARCHAR(36) PRIMARY KEY,
      patient_id VARCHAR(36) NOT NULL,
      doctor_id VARCHAR(36) NOT NULL,
      prescription_date DATE NOT NULL,
      patient_name VARCHAR(255),
      blood_pressure VARCHAR(20),
      pulse_rate VARCHAR(20),
      height VARCHAR(20),
      weight VARCHAR(20),
      medications JSON,
      pdf_file LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Prescription table:', err);
      return;
    }
    console.log('Prescription table created successfully');
  });
};

export default createPrescriptionTable;
