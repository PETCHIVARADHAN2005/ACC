import connection from '../config/mysql.js';

const createAuthTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Auth (
      id INT PRIMARY KEY AUTO_INCREMENT,
      doctor_id VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL DEFAULT '12345678',
      FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id),
      created_by VARCHAR(255) Default 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_by VARCHAR(255),
      updated_at TIMESTAMP 
    )
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error creating Auth table:', err);
      return;
    }
    console.log('Auth table created successfully');
  });
};

export default createAuthTable;
