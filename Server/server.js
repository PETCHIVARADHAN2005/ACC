import express from 'express';
import connection from './config/mysql.js';
import adminrouter from './routes/adminroute.js';
import doctorrouter from './routes/doctorroute.js';
import connectCloudinary from './config/cloudinary.js';
import cors from 'cors';
import Patientrouter from './routes/Patientroute.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json());
app.use(cors());
connectCloudinary();
// Middleware to attach db connection to request object
app.use((req, res, next) => {
  req.db = connection;
  next();
});


// // Routes
app.use('/api/doctor', doctorrouter);
app.use('/api/admin',adminrouter);
app.use('/api/patient',Patientrouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
