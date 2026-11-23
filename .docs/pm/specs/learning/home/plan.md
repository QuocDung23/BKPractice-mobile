# Kế hoạch — Trang chủ learning

Trạng thái: Approved  
Ngày: 2026-11-20  
Spec: [spec.md](./spec.md) — Approved. Kế hoạch đã được duyệt để triển khai; đối chiếu hợp đồng backend trong quá trình code.

## Triển khai dự kiến

1. Chốt câu hỏi trong spec; đối chiếu controller, DTO, quyền, gateway, lỗi và test backend cho từng endpoint. Ghi mapping trường và request/response chính xác trước khi triển khai; không suy đoán dữ liệu thiếu.
2. Thay dữ liệu learning trong `src/lib/home/demo-home.ts`, điều chỉnh `src/domain/home`, `src/hooks/auth/use-home-data.ts`, `home-view` và `home-course-card`; giữ dữ liệu phiên/profile theo luồng hiện có. Tái dùng nghiệp vụ đã có khi phù hợp, truyền ID thật trong điều hướng.
3. Theo kiến trúc, đặt model/interface và use case nghiệp vụ trong domain, HTTP/response mapping trong lib, trạng thái tải/lỗi trong hook, UI trong components và route mỏng trong app. Tái dùng HTTP client, session và config; không thêm dependency chưa cần.
4. Kiểm tra response tại ranh giới mạng, xử lý lỗi và thay đổi phiên; loại bỏ demo trong luồng đã nối. Nếu contract chưa có phần cần thiết, dừng tại câu hỏi thay vì dựng API hoặc giá trị giả.
5. Sau khi được duyệt, kiểm tra điều hướng, trạng thái, quyền và các trường hợp biên trên iOS/Android; chạy `npx tsc --noEmit`, `npm run lint`, kiểm thử logic đáng kể và ghi work note theo quy trình.

## Phụ thuộc và rủi ro

Chốt thẻ nào cần hiển thị, quy tắc chọn khóa/bài/quiz, nguồn streak, XP, thành tích, focus hours và thông báo; xác định API, số request và xử lý lỗi từng phần. Phụ thuộc các module nguồn đã sẵn sàng. Trước khi chạm API Expo/React Native, tra tài liệu SDK đúng phiên bản theo AGENTS.md. Thay đổi không bao gồm backend.
