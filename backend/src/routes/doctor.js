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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Doctor_1 = require("../models/Doctor");
const router = (0, express_1.Router)();
// Lấy danh sách bác sĩ
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorRepo = data_source_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctors = yield doctorRepo.find();
        res.json(doctors);
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
}));
exports.default = router;
