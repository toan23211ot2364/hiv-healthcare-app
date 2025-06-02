import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Appointment } from '../models/Appointment';
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

// Đặt lịch khám
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { doctorId, appointmentDate, note } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const doctorRepo = AppDataSource.getRepository(Doctor);
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const user = await userRepo.findOneBy({ id: req.user.userId });
    const doctor = await doctorRepo.findOneBy({ id: doctorId });
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
    await appointmentRepo.save(appointment);
    res.status(201).json({ message: 'Đặt lịch thành công', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Lấy lịch sử đặt lịch của user
router.get('/my', authMiddleware, async (req: any, res) => {
  try {
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const list = await appointmentRepo.find({
      where: { user: { id: req.user.userId } },
      relations: ['doctor'],
      order: { appointmentDate: 'DESC' },
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Lấy toàn bộ lịch hẹn (chỉ admin)
router.get('/all', authMiddleware, async (req: any, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: req.user.userId });
    if (!user || user.email !== 'admin@hiv.com') {
      res.status(403).json({ message: 'Chỉ admin được phép xem toàn bộ lịch hẹn.' });
      return;
    }
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const list = await appointmentRepo.find({
      relations: ['doctor', 'user'],
      order: { appointmentDate: 'DESC' },
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Lấy lịch hẹn của bác sĩ (bác sĩ đăng nhập)
router.get('/doctor', authMiddleware, async (req: any, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const doctorRepo = AppDataSource.getRepository(Doctor);
    const user = await userRepo.findOneBy({ id: req.user.userId });
    const doctor = await doctorRepo.findOneBy({ email: user?.email });
    if (!doctor) {
      res.status(403).json({ message: 'Chỉ bác sĩ được phép xem lịch hẹn này.' });
      return;
    }
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const list = await appointmentRepo.find({
      where: { doctor: { id: doctor.id } },
      relations: ['user'],
      order: { appointmentDate: 'DESC' },
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

export default router;

export {};
