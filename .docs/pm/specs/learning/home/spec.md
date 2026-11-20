# Learning — Trang chủ learning

Trạng thái: Draft  
Ngày: 2026-11-20

## Mục tiêu và phạm vi

Hiển thị dữ liệu learning cần thiết trên Home của sinh viên từ các nguồn đã được xác nhận, điều hướng tới đúng đối tượng. Đối tượng là sinh viên đã đăng nhập; không bao gồm chức năng quản trị hay thay đổi backend.

## Yêu cầu

- Dùng dữ liệu thật theo hợp đồng được xác nhận; không trình bày dữ liệu mẫu hoặc giá trị tự suy đoán như dữ liệu server.
- Chỉ tải dữ liệu khi phiên hợp lệ, sử dụng cơ chế access token và refresh hiện có. Tôn trọng quyền do server thực thi.
- Phân biệt đang tải, rỗng, lỗi có thể thử lại, không có quyền/không tìm thấy và phiên hết hạn. Không chuyển lỗi thành thành công rỗng; không chuyển trạng thái đang tải thành đăng xuất.
- Truyền định danh thực giữa danh sách, chi tiết và hành động; không giữ một đối tượng mẫu cố định cho mọi lựa chọn.
- Dữ liệu server thiếu trường UI: chỉ trình bày giá trị có nguồn hoặc hành vi đã được phê duyệt. Không lộ token, dữ liệu riêng hay chi tiết lỗi nội bộ.

## API dự kiến

Chưa xác nhận API tổng hợp; có thể dùng nguồn từ courses, progress, assignments hoặc quiz khi hợp đồng và phạm vi được duyệt. Đường dẫn là các endpoint được khảo sát, không phải xác nhận đầy đủ DTO, quyền hoặc hành vi runtime.

## Tiêu chí nghiệm thu

- Thẻ có dữ liệu thật mở đúng đối tượng; không hiển thị số liệu mẫu là thật; một nguồn lỗi không biến thành số 0 và có trạng thái phù hợp.
- Với mạng lỗi, `403`, `404` và phiên hết hạn, trạng thái tương ứng được xử lý rõ ràng, không hiển thị thành công giả; có thể thử lại khi phù hợp.
- Màn hình hoạt động với dữ liệu rỗng và nội dung dài trên iOS/Android; không dùng dữ liệu demo như dữ liệu API.

## Câu hỏi cần chốt trước khi duyệt

Chốt thẻ nào cần hiển thị, quy tắc chọn khóa/bài/quiz, nguồn streak, XP, thành tích, focus hours và thông báo; xác định API, số request và xử lý lỗi từng phần. Phụ thuộc các module nguồn đã sẵn sàng.

## Phụ thuộc

[Kiến trúc](../../../architecture/README.md), [quy trình](../../../../agent/working-agreement.md), phiên đăng nhập hiện có và hợp đồng backend tương ứng. Spec này chưa Approved; các câu hỏi trên phải được giải quyết trước khi cho phép sửa `src/`.
