import express from 'express';
import connection from './config/mysql.js';
import adminrouter from './routes/adminroute.js';
import doctorrouter from './routes/doctorroute.js';
import cors from 'cors';

// After your database connection is established


// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Middleware to attach db connection to request object
app.use((req, res, next) => {
  req.db = connection;
  next();
});


// // Routes
app.use('/api/doctor', doctorrouter);
app.use('/api/admin',adminrouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
