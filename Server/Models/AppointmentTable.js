import connection from '../config/mysql.js';

const createAppointmentTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Appointment (
      appointment_id VARCHAR(255) PRIMARY KEY,
      doctor_id VARCHAR(255) NOT NULL,
      patient_id VARCHAR(255) NOT NULL,
      slot_id INT,  /* Use the same type as in DoctorSlots table */
      appointment_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      status ENUM('scheduled', 'completed', 'cancelled', 'no-show') DEFAULT 'scheduled',
      reason TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id),
      FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
      FOREIGN KEY (slot_id) REFERENCES DoctorSlots(slot_id) ON DELETE SET NULL
    )
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Appointment table:', err);
      return;
    }
    console.log('Appointment table created successfully');
  });
};

export default createAppointmentTable;
