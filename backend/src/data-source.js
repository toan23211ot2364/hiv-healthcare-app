"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./models/User");
const Doctor_1 = require("./models/Doctor");
const Appointment_1 = require("./models/Appointment");
const MedicalRecord_1 = require("./models/MedicalRecord");
const Blog_1 = require("./models/Blog");
const EducationMaterial_1 = require("./models/EducationMaterial");
const ARVRegimen_1 = require("./models/ARVRegimen");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true, // Chỉ dùng cho dev, production nên dùng migration
    logging: false,
    entities: [User_1.User, Doctor_1.Doctor, Appointment_1.Appointment, MedicalRecord_1.MedicalRecord, Blog_1.Blog, EducationMaterial_1.EducationMaterial, ARVRegimen_1.ARVRegimen],
    migrations: [],
    subscribers: [],
});
