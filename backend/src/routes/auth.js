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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Đăng ký tài khoản (có thể ẩn danh)
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullName, phone, address, isAnonymous } = req.body;
        if (!isAnonymous && (!email || !password)) {
            res.status(400).json({ message: 'Email và mật khẩu là bắt buộc nếu không ẩn danh.' });
            return;
        }
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        if (!isAnonymous && (yield userRepo.findOneBy({ email }))) {
            res.status(400).json({ message: 'Email đã tồn tại.' });
            return;
        }
        const hash = password ? yield bcryptjs_1.default.hash(password, 10) : undefined;
        const user = userRepo.create({
            email: isAnonymous ? undefined : email,
            password: hash,
            fullName,
            phone,
            address,
            isAnonymous: !!isAnonymous,
        });
        yield userRepo.save(user);
        res.status(201).json({ message: 'Đăng ký thành công', user: { id: user.id, isAnonymous: user.isAnonymous } });
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
}));
// Đăng nhập
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOneBy({ email });
        if (!user || !user.password) {
            res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
            return;
        }
        const match = yield bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, isAnonymous: user.isAnonymous }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, isAnonymous: user.isAnonymous } });
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
}));
exports.default = router;
