import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { MedicalRecord } from '../models/MedicalRecord';
import { User } from '../models/User';
import { Doctor } from '../models/Doctor';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware xác thực JWT
function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Thiếu token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

// Lấy lịch sử hồ sơ y tế của user (bao gồm ARV, CD4, tải lượng HIV, note, bác sĩ)
router.get('/my', authMiddleware, async (req: any, res) => {
  try {
    const medicalRepo = AppDataSource.getRepository(MedicalRecord);
    const list = await medicalRepo.find({
      where: { user: { id: req.user.userId } },
      relations: ['doctor', 'user'],
      order: { createdAt: 'DESC' },
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Tạo mới hồ sơ y tế (bác sĩ hoặc hệ thống tạo khi có kết quả xét nghiệm)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { doctorId, arvRegimen, cd4, hivViralLoad, note } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const doctorRepo = AppDataSource.getRepository(Doctor);
    const medicalRepo = AppDataSource.getRepository(MedicalRecord);
    const user = await userRepo.findOneBy({ id: req.user.userId });
    const doctor = await doctorRepo.findOneBy({ id: doctorId });
    if (!user || !doctor) {
      res.status(404).json({ message: 'Không tìm thấy user hoặc bác sĩ' });
      return;
    }
    const record = medicalRepo.create({
      user,
      doctor,
      arvRegimen,
      cd4,
      hivViralLoad,
      note,
    });
    await medicalRepo.save(record);
    res.status(201).json({ message: 'Tạo hồ sơ y tế thành công', record });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

export default router;
