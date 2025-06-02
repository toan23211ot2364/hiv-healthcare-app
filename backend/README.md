# Backend - HIV Healthcare Web App

## Công nghệ sử dụng
- Node.js, ExpressJS, TypeScript
- PostgreSQL
- JWT Authentication (hỗ trợ anonymous)
- Multer (upload file), Nodemailer (email notification)

## Cài đặt & chạy thử
```bash
cd backend
npm install
cp .env.example .env # Tạo file cấu hình môi trường
npm run dev
```

## Cấu trúc chính
- API RESTful: đăng ký, đăng nhập, đặt lịch, tra cứu, quản lý bác sĩ, bệnh nhân, blog...
- Quản lý hồ sơ bệnh nhân, bác sĩ, phác đồ ARV
- Dashboard báo cáo
- Bảo mật, mã hoá dữ liệu nhạy cảm

## Cấu hình môi trường
- Sửa file `.env` để cấu hình kết nối database, JWT secret, email...

## Build production
```bash
npm run build
node dist/index.js
```

## Đóng góp
Pull request, issue, góp ý vui lòng gửi về repo này.
