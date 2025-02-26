// middleware/authdoctor.js
import jwt from 'jsonwebtoken';

const authdoctor = (req, res, next) => {
    console.log("authdoctor middleware called");
    console.log("Headers:", req.headers);
    
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Token:", token);
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // For FormData requests, create doctor_id field
        if (req.headers['content-type']?.includes('multipart/form-data')) {
            // Don't modify req.body directly as it's part of FormData
            req.doctor_id = decoded.doctor_id; // Store in req object instead
        } else {
            // For JSON requests, modify body as before
            req.body.doctor_id = decoded.doctor_id;
        }
        
        console.log("Decoded doctor_id:", decoded.doctor_id);
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

export default authdoctor;