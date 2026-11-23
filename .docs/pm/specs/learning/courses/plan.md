# Kế hoạch — Khóa học

Trạng thái: Approved  
Ngày: 2026-11-20  
Spec: [spec.md](./spec.md) — Approved. Kế hoạch đã được duyệt để triển khai; đối chiếu hợp đồng backend trong quá trình code.

## Triển khai dự kiến

1. Chốt câu hỏi trong spec; đối chiếu controller, DTO, quyền, gateway, lỗi và test backend cho từng endpoint. Ghi mapping trường và request/response chính xác trước khi triển khai; không suy đoán dữ liệu thiếu.
2. Thay `src/hooks/courses/use-course-data.ts` và nguồn `src/lib/courses/demo-courses.ts`; cập nhật model courses, `courses-view`, `course-card`, `course-detail-view`, `lesson-row` và route liên quan để truyền ID/slug thực. Tiến độ là dữ liệu riêng, không mặc định bằng 0 khi request thất bại.
3. Theo kiến trúc, đặt model/interface và use case nghiệp vụ trong domain, HTTP/response mapping trong lib, trạng thái tải/lỗi trong hook, UI trong components và route mỏng trong app. Tái dùng HTTP client, session và config; không thêm dependency chưa cần.
4. Kiểm tra response tại ranh giới mạng, xử lý lỗi và thay đổi phiên; loại bỏ demo trong luồng đã nối. Nếu contract chưa có phần cần thiết, dừng tại câu hỏi thay vì dựng API hoặc giá trị giả.
5. Sau khi được duyệt, kiểm tra điều hướng, trạng thái, quyền và các trường hợp biên trên iOS/Android; chạy `npx tsc --noEmit`, `npm run lint`, kiểm thử logic đáng kể và ghi work note theo quy trình.

Phối hợp [Chapter](../chapters/plan.md) để dùng chung dữ liệu chi tiết khóa học.

## Phụ thuộc và rủi ro

Xác nhận chapter và problem/quiz trong DTO là các mục nào có thể mở; backend chưa được xác nhận có nội dung lesson, thời khóa biểu và giảng viên như UI mẫu. Chốt cách thay/ẩn màn lesson và các trường thiếu, cùng ý nghĩa bộ lọc tiến độ và xử lý phân trang. Trước khi chạm API Expo/React Native, tra tài liệu SDK đúng phiên bản theo AGENTS.md. Thay đổi không bao gồm backend.
