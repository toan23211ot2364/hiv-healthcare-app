// src/index.ts
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRouter from './routes/auth';
import appointmentRouter from './routes/appointment';
import doctorRouter from './routes/doctor';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('HIV Healthcare API is running');
});

app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/doctors', doctorRouter);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('Error during Data Source initialization', err);
  });
