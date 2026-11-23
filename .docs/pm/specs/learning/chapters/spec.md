# Learning — Chapter

Trạng thái: Approved  
Ngày: 2026-11-20

## Mục tiêu và phạm vi

Sinh viên xem các chapter trong một khóa học đã công bố, cùng problem và quiz có trong từng chapter. Courses sở hữu tải chi tiết khóa học; module này mô tả phần trình bày và điều hướng chapter. Không bao gồm tạo, sửa, xóa hoặc sắp xếp chapter dành cho quản trị.

## Hợp đồng đã khảo sát

`GET /api/courses/:idOrSlug` trả chi tiết khóa học có `chapters`. Mỗi chapter có `id`, `title`, `description` có thể null, `problems` và `quizzes` có thể vắng mặt. Problem có `id`, `slug`, `title`, `problemType`, `difficulty`; quiz có `id`, `title`. DTO và mapper nằm trong `apps/learning-service/src/modules/courses/presentation/http/` của backend. Chưa xác nhận thêm endpoint đọc chapter riêng cho người học; không cần giả định endpoint đó.

## Yêu cầu và nghiệm thu

- Khi mở khóa học, trình bày đúng các chapter và nội dung do response của khóa học đó trả về; giữ thứ tự response. Không biến chapter của khóa khác thành nội dung hiện tại.
- Cho phép chọn problem và quiz có trong chapter để mở module tương ứng bằng định danh thật, khi luồng đích đã hỗ trợ. Không dùng ID mẫu.
- Xử lý chapter không có nội dung, description null, quizzes vắng mặt, đang tải và lỗi rõ ràng; không xem lỗi là danh sách rỗng.
- Không coi chapter là lesson có nội dung văn bản, thời lượng hoặc trạng thái hoàn thành nếu backend không cung cấp hoặc quy tắc chưa được duyệt.
- Kiểm thử ít nhất hai khóa với chapter khác nhau, chapter rỗng và điều hướng đúng problem/quiz; xác minh quyền và lỗi với backend.

## Câu hỏi mở / rủi ro triển khai

Chốt cách hiển thị chapter trong màn chi tiết và cách thay hoặc ẩn màn lesson demo; xác nhận hành vi khi quiz trong response nhưng người học không có quyền mở, ý nghĩa thứ tự và nguồn tiến độ chapter nếu muốn hiển thị. Các luồng mở problem và quiz phụ thuộc spec tương ứng.

## Phụ thuộc

[Courses](../courses/spec.md), [Problems](../problems/spec.md), [Quiz](../quiz/spec.md), [kiến trúc](../../../architecture/README.md) và [quy trình](../../../../agent/working-agreement.md). Spec đã Approved; các câu hỏi trên vẫn là rủi ro cần đối chiếu khi triển khai.
