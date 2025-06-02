import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import { Doctor } from './models/Doctor';
import { Appointment } from './models/Appointment';
import { MedicalRecord } from './models/MedicalRecord';
import { Blog } from './models/Blog';
import { EducationMaterial } from './models/EducationMaterial';
import { ARVRegimen } from './models/ARVRegimen';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // Chỉ dùng cho dev, production nên dùng migration
  logging: false,
  entities: [User, Doctor, Appointment, MedicalRecord, Blog, EducationMaterial, ARVRegimen],
  migrations: [],
  subscribers: [],
});

export {};
