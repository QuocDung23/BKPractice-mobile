# Kế hoạch — Chạy và nộp bài

Trạng thái: Approved  
Ngày: 2026-11-20  
Spec: [spec.md](./spec.md) — Approved. Kế hoạch đã được duyệt để triển khai; đối chiếu hợp đồng backend trong quá trình code.

## Triển khai dự kiến

1. Chốt câu hỏi trong spec; đối chiếu controller, DTO, quyền, gateway, lỗi và test backend cho từng endpoint. Ghi mapping trường và request/response chính xác trước khi triển khai; không suy đoán dữ liệu thiếu.
2. Đặt model/use case tại `src/domain/submissions`, repository tại `src/lib/submissions`, hook tại `src/hooks/submissions` khi thực sự cần; nối `problem-detail-view`, `submission-result-view` và routes, truyền problem ID và public submission ID. Xác định từ DTO input, ngôn ngữ, trạng thái bất đồng bộ, quyền và kết quả hiển thị.
3. Theo kiến trúc, đặt model/interface và use case nghiệp vụ trong domain, HTTP/response mapping trong lib, trạng thái tải/lỗi trong hook, UI trong components và route mỏng trong app. Tái dùng HTTP client, session và config; không thêm dependency chưa cần.
4. Kiểm tra response tại ranh giới mạng, xử lý lỗi và thay đổi phiên; loại bỏ demo trong luồng đã nối. Nếu contract chưa có phần cần thiết, dừng tại câu hỏi thay vì dựng API hoặc giá trị giả.
5. Sau khi được duyệt, kiểm tra điều hướng, trạng thái, quyền và các trường hợp biên trên iOS/Android; chạy `npx tsc --noEmit`, `npm run lint`, kiểm thử logic đáng kể và ghi work note theo quy trình.

## Phụ thuộc và rủi ro

Chốt phạm vi UI nhập mã, lựa chọn ngôn ngữ, chạy thử so với nộp, cơ chế cập nhật trạng thái, giới hạn và xử lý khi kết quả request không chắc chắn; đối chiếu DTO, quyền và gateway. Không tự động thử lại thao tác tạo khi có thể tạo bản nộp trùng. Trước khi chạm API Expo/React Native, tra tài liệu SDK đúng phiên bản theo AGENTS.md. Thay đổi không bao gồm backend.
