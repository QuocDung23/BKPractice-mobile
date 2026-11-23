# Learning — Bài lập trình

Trạng thái: Approved  
Ngày: 2026-11-20

## Mục tiêu và phạm vi

Danh sách bài đã công bố, lọc theo khả năng API, xem đề và trạng thái làm bài của chính sinh viên. Đối tượng là sinh viên đã đăng nhập; không bao gồm chức năng quản trị hay thay đổi backend.

## Yêu cầu

- Dùng dữ liệu thật theo hợp đồng được xác nhận; không trình bày dữ liệu mẫu hoặc giá trị tự suy đoán như dữ liệu server.
- Chỉ tải dữ liệu khi phiên hợp lệ, sử dụng cơ chế access token và refresh hiện có. Tôn trọng quyền do server thực thi.
- Phân biệt đang tải, rỗng, lỗi có thể thử lại, không có quyền/không tìm thấy và phiên hết hạn. Không chuyển lỗi thành thành công rỗng; không chuyển trạng thái đang tải thành đăng xuất.
- Truyền định danh thực giữa danh sách, chi tiết và hành động; không giữ một đối tượng mẫu cố định cho mọi lựa chọn.
- Dữ liệu server thiếu trường UI: chỉ trình bày giá trị có nguồn hoặc hành vi đã được phê duyệt. Không lộ token, dữ liệu riêng hay chi tiết lỗi nội bộ.

## API dự kiến

`GET /api/problems`, `GET /api/problems/:idOrSlug`, `GET /api/progress/me/problems`, `GET /api/progress/me/problems/status`. Đường dẫn là các endpoint được khảo sát, không phải xác nhận đầy đủ DTO, quyền hoặc hành vi runtime.

## Tiêu chí nghiệm thu

- Chọn hai bài khác nhau mở đúng đề; lọc và phân trang đúng hợp đồng; trạng thái của người học đúng và không bị suy ra khi progress lỗi.
- Với mạng lỗi, `403`, `404` và phiên hết hạn, trạng thái tương ứng được xử lý rõ ràng, không hiển thị thành công giả; có thể thử lại khi phù hợp.
- Màn hình hoạt động với dữ liệu rỗng và nội dung dài trên iOS/Android; không dùng dữ liệu demo như dữ liệu API.

## Câu hỏi mở / rủi ro triển khai

Chốt bộ lọc, cách kết hợp và phân trang giữa problem và progress; xác nhận trường acceptance, topic và số thứ tự UI nào có nguồn thật. Luồng chạy/nộp thuộc [Submissions](../../submissions/spec.md).

## Phụ thuộc

[Kiến trúc](../../../architecture/README.md), [quy trình](../../../../agent/working-agreement.md), phiên đăng nhập hiện có và hợp đồng backend tương ứng. Spec đã Approved; các câu hỏi trên vẫn là rủi ro cần đối chiếu với hợp đồng backend khi triển khai.
