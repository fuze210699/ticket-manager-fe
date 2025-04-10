# Code Viewer Widget with DeepSeek AI Integration

## Cài đặt

1. Sao chép mã nguồn:
```bash
git clone <repository-url>
cd ticket-manager-fe
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` tại thư mục gốc và thêm DeepSeek API key:
```
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

4. Khởi động server proxy DeepSeek:
```bash
npm run server
```

5. Chạy ứng dụng Vue trong một terminal khác:
```bash
npm run dev
```

## Cấu trúc Dự án

- `src/infrastructure/api/deepseekService.js`: Service API cho DeepSeek
- `src/infrastructure/widgets/code_viewer/CodeViewerWidget.vue`: Widget xem và phân tích code
- `server.js`: Server proxy để tương tác với DeepSeek API

## Thiết lập DeepSeek API

1. Tạo tài khoản tại platform.deepseek.com
2. Tạo API key và thêm vào file `.env`
3. Đảm bảo proxy server đang chạy (npm run server)

## Các tính năng

- Xem code với highlight cú pháp
- Phân tích code tự động bằng DeepSeek AI
- Đề xuất cải tiến code với lý giải chi tiết
- Hỗ trợ nhiều ngôn ngữ lập trình
