// Tạo tài khoản mẫu: admin, bác sĩ, bệnh nhân cho hệ thống
import { AppDataSource } from "./data-source";
import { User } from "./models/User";
import { Doctor } from "./models/Doctor";
import bcrypt from "bcryptjs";

async function seed() {
  await AppDataSource.initialize();

  // 1. Admin
  const adminRepo = AppDataSource.getRepository(User);
  const adminEmail = "admin@hiv.com";
  const adminExists = await adminRepo.findOneBy({ email: adminEmail });
  if (!adminExists) {
    const admin = adminRepo.create({
      email: adminEmail,
      password: await bcrypt.hash("admin123", 10),
      fullName: "Admin Hệ thống",
      isAnonymous: false,
      // Có thể thêm trường role nếu cần
    });
    await adminRepo.save(admin);
    console.log("Đã tạo tài khoản admin:", adminEmail);
  }

  // 2. Bệnh nhân
  const patientRepo = AppDataSource.getRepository(User);
  const patientEmail = "patient@hiv.com";
  const patientExists = await patientRepo.findOneBy({ email: patientEmail });
  if (!patientExists) {
    const patient = patientRepo.create({
      email: patientEmail,
      password: await bcrypt.hash("patient123", 10),
      fullName: "Nguyễn Văn Bệnh Nhân",
      isAnonymous: false,
    });
    await patientRepo.save(patient);
    console.log("Đã tạo tài khoản bệnh nhân:", patientEmail);
  }

  // 3. Bác sĩ
  const doctorRepo = AppDataSource.getRepository(Doctor);
  const doctorEmail = "doctor@hiv.com";
  const doctorExists = await doctorRepo.findOneBy({ email: doctorEmail });
  if (!doctorExists) {
    const doctor = doctorRepo.create({
      email: doctorEmail,
      fullName: "BS. Trần Thị Bác Sĩ",
      phone: "0901234567",
      degree: "Bác sĩ chuyên khoa",
      specialty: "HIV/AIDS",
      workSchedule: "Thứ 2-6, 8:00-16:00"
    });
    await doctorRepo.save(doctor);
    console.log("Đã tạo tài khoản bác sĩ:", doctorEmail);
  }

  await AppDataSource.destroy();
  console.log("Seeding hoàn tất!");
}

seed().catch(console.error);
