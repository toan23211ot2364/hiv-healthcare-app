import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Doctor } from '../models/Doctor';

const router = Router();

// Lấy danh sách bác sĩ
router.get('/', async (req, res) => {
  try {
    const doctorRepo = AppDataSource.getRepository(Doctor);
    const doctors = await doctorRepo.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

export default router;
export {};
