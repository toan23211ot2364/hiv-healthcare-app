"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Appointment_1 = require("../models/Appointment");
const User_1 = require("../models/User");
const Doctor_1 = require("../models/Doctor");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
// Middleware xác thực JWT
function authMiddleware(req, res, next) {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Thiếu token' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_b) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
}
// Đặt lịch khám
router.post('/', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, appointmentDate, note } = req.body;
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const doctorRepo = data_source_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const appointmentRepo = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const user = yield userRepo.findOneBy({ id: req.user.userId });
        const doctor = yield doctorRepo.findOneBy({ id: doctorId });
        if (!user || !doctor) {
            res.status(404).json({ message: 'Không tìm thấy user hoặc bác sĩ' });
            return;
        }
        const appointment = appointmentRepo.create({
            user,
            doctor,
            appointmentDate,
            note,
            status: 'pending',
        });
        yield appointmentRepo.save(appointment);
        res.status(201).json({ message: 'Đặt lịch thành công', appointment });
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
}));
// Lấy lịch sử đặt lịch của user
router.get('/my', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentRepo = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const list = yield appointmentRepo.find({
            where: { user: { id: req.user.userId } },
            relations: ['doctor'],
            order: { appointmentDate: 'DESC' },
        });
        res.json(list);
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
}));
exports.default = router;
