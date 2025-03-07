import connection from '../config/mysql.js';

const createDoctorTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Doctor (
      doctor_id VARCHAR(255) PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      personal_email VARCHAR(255) UNIQUE NOT NULL,
      emergency_email VARCHAR(255) UNIQUE ,
      phone_number VARCHAR(20) NOT NULL,
      profile_image TEXT,
      gender VARCHAR(20),
      dob DATE,
      blood_group VARCHAR(5),
      aadhar_number VARCHAR(20),
      emergency_phone VARCHAR(20),
      permanent_address_country VARCHAR(100),
      permanent_address_state VARCHAR(100),
      permanent_address_district VARCHAR(100),
      permanent_address_pincode VARCHAR(10),
      permanent_address_line TEXT,
      current_address_country VARCHAR(100),
      current_address_state VARCHAR(100),
      current_address_district VARCHAR(100),
      current_address_pincode VARCHAR(10),
      current_address_line TEXT,
      created_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_by VARCHAR(255),
      updated_at TIMESTAMP 
    )
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Doctor table:', err);
      return;
    }
    console.log('Doctor table created successfully');
  });
};

export default createDoctorTable;

