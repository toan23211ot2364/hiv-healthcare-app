# HIV Healthcare Web App

## Mô tả
Ứng dụng web fullstack hỗ trợ quản lý, điều trị HIV cho cơ sở y tế. Gồm frontend (Next.js/React/TypeScript/Tailwind) và backend (Node.js/Express/TypeScript/PostgreSQL).

## Cấu trúc thư mục
- `frontend/`: Giao diện người dùng (Next.js)
- `backend/`: Server API, database, authentication (ExpressJS)

## Hướng dẫn cài đặt nhanh

### Yêu cầu
- Node.js >= 18
- PostgreSQL >= 13
- Docker (nếu muốn chạy bằng container)

### Cài đặt frontend
```bash
cd frontend
npm install
npm run dev
```

### Cài đặt backend
```bash
cd backend
npm install
# Cấu hình file .env (xem hướng dẫn trong backend/README.md)
npx prisma migrate dev # (nếu dùng Prisma)
npm run dev
```

### Tài liệu chi tiết
- Xem thêm trong `frontend/README.md` và `backend/README.md`.

---

## Tính năng chính
- Đăng ký, đăng nhập (hỗ trợ ẩn danh)
- Đặt lịch khám, nhắc nhở tái khám/uống thuốc
- Tra cứu kết quả, lịch sử điều trị
- Đặt lịch tư vấn online
- Dashboard báo cáo, thống kê
- Quản lý hồ sơ bệnh nhân, bác sĩ, phác đồ ARV
- Upload tài liệu, hình ảnh
- Bảo mật, mã hoá dữ liệu nhạy cảm

---

## DevOps
- Docker, CI/CD, deploy cloud

---

## Đóng góp
Pull request, issue, góp ý vui lòng gửi về repo này.
