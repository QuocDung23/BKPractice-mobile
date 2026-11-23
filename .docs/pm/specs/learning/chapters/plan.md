# Kế hoạch — Chapter

Trạng thái: Approved  
Ngày: 2026-11-20

Spec: [spec.md](./spec.md) — Approved. Kế hoạch đã được duyệt để triển khai; đối chiếu hợp đồng backend trong quá trình code.

1. Đối chiếu DTO, mapper, quyền và test backend; xác nhận trường hợp quizzes vắng mặt và cách điều hướng khi không đủ quyền.
2. Tái dùng response/repository chi tiết của [Courses](../courses/plan.md), ánh xạ chapter vào model phù hợp; không gọi lại cùng endpoint chỉ để lấy chapter. Không tạo hạ tầng riêng nếu không cần.
3. Cập nhật `src/components/courses/course-detail-view.tsx` và component con phù hợp để hiện chapter, problems và quizzes; thay thế hoặc ẩn lesson demo theo quyết định được duyệt. Truyền ID thật qua route mỏng tới Problems/Quiz, theo hợp đồng của các module đó.
4. Kiểm thử chapter rỗng, dữ liệu thiếu tùy chọn, lỗi, đúng khóa và điều hướng. Chạy `npx tsc --noEmit`, `npm run lint`, kiểm thử phù hợp và ghi work note. Tra docs SDK khi chạm Expo/React Native theo AGENTS.md.
