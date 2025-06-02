import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';

const router = Router();

// Đăng ký tài khoản (có thể ẩn danh)
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, address, isAnonymous } = req.body;
    if (!isAnonymous && (!email || !password)) {
      res.status(400).json({ message: 'Email và mật khẩu là bắt buộc nếu không ẩn danh.' });
      return;
    }
    const userRepo = AppDataSource.getRepository(User);
    if (!isAnonymous && await userRepo.findOneBy({ email })) {
      res.status(400).json({ message: 'Email đã tồn tại.' });
      return;
    }
    const hash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = userRepo.create({
      email: isAnonymous ? undefined : email,
      password: hash,
      fullName,
      phone,
      address,
      isAnonymous: !!isAnonymous,
    });
    await userRepo.save(user);
    res.status(201).json({ message: 'Đăng ký thành công', user: { id: user.id, isAnonymous: user.isAnonymous } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });
    if (!user || !user.password) {
      res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }
    const token = jwt.sign({ userId: user.id, isAnonymous: user.isAnonymous }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, isAnonymous: user.isAnonymous } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
});

export {};
export default router;
