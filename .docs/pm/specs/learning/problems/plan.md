# Kế hoạch — Bài lập trình

Trạng thái: Draft  
Ngày: 2026-11-20  
Spec: [spec.md](./spec.md) — Draft. Kế hoạch là đề xuất, cần cập nhật sau khi chốt hợp đồng và duyệt spec; không mở cổng coding.

## Triển khai dự kiến

1. Chốt câu hỏi trong spec; đối chiếu controller, DTO, quyền, gateway, lỗi và test backend cho từng endpoint. Ghi mapping trường và request/response chính xác trước khi triển khai; không suy đoán dữ liệu thiếu.
2. Thay `src/hooks/problems/use-problem-data.ts` và `src/lib/problems/demo-problems.ts`; cập nhật domain problems, danh sách, hàng, chi tiết và route truyền ID/slug. Đối chiếu query, DTO đề, ví dụ công khai và trạng thái progress; không gọi endpoint managed.
3. Theo kiến trúc, đặt model/interface và use case nghiệp vụ trong domain, HTTP/response mapping trong lib, trạng thái tải/lỗi trong hook, UI trong components và route mỏng trong app. Tái dùng HTTP client, session và config; không thêm dependency chưa cần.
4. Kiểm tra response tại ranh giới mạng, xử lý lỗi và thay đổi phiên; loại bỏ demo trong luồng đã nối. Nếu contract chưa có phần cần thiết, dừng tại câu hỏi thay vì dựng API hoặc giá trị giả.
5. Sau khi được duyệt, kiểm tra điều hướng, trạng thái, quyền và các trường hợp biên trên iOS/Android; chạy `npx tsc --noEmit`, `npm run lint`, kiểm thử logic đáng kể và ghi work note theo quy trình.

## Phụ thuộc và rủi ro

Chốt bộ lọc, cách kết hợp và phân trang giữa problem và progress; xác nhận trường acceptance, topic và số thứ tự UI nào có nguồn thật. Luồng chạy/nộp thuộc submissions. Trước khi chạm API Expo/React Native, tra tài liệu SDK đúng phiên bản theo AGENTS.md. Thay đổi không bao gồm backend.
