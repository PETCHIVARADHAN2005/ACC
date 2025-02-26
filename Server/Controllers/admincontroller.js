import connection from '../config/mysql.js';

const addDoctor = async (req, res) => {
    try {
        const { first_name, last_name, personal_email, phone_number } = req.body;
        const doctor_id = `${first_name}@acc.com`;

        const insertDoctorQuery = `
            INSERT INTO Doctor (
                doctor_id,
                first_name,
                last_name,
                personal_email,
                phone_number,
                created_by,
                created_at
            )
            SELECT
                ?,
                ?,
                ?,
                ?,
                ?,
                'admin',
                NOW()
            WHERE NOT EXISTS (
                SELECT 1 FROM Doctor WHERE doctor_id = ?
            )
        `;

        const insertAuthQuery = `
            INSERT INTO Auth (doctor_id) VALUES (?)
        `;

        connection.query(insertDoctorQuery, [doctor_id, first_name, last_name, personal_email, phone_number, doctor_id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to add doctor',
                    details: err.message
                });
            }

            // Insert into Auth table
            connection.query(insertAuthQuery, [doctor_id], (authErr, authResult) => {
                if (authErr) {
                    console.error("Auth Table Error:", authErr);
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create auth credentials',
                        details: authErr.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Doctor added successfully with default credentials'
                });
            });
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            error: 'Failed to add doctor',
            details: err.message
        });
    }
};


export { addDoctor };
