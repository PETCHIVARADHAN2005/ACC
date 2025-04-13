import connection from '../config/mysql.js';

const createDoctorSlotsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS DoctorSlots (
      slot_id INT PRIMARY KEY AUTO_INCREMENT,
      doctor_id VARCHAR(255) NOT NULL,
      slot_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
    )
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating DoctorSlots table:', err);
      return;
    }
    console.log('DoctorSlots table created successfully');
  });
};

export default createDoctorSlotsTable;