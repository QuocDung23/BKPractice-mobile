# Learning — Bài được giao

Trạng thái: Approved  
Ngày: 2026-11-20

## Mục tiêu và phạm vi

Danh sách và chi tiết bài được giao cho sinh viên, bao gồm thông tin và các bài con thực sự được cung cấp. Đối tượng là sinh viên đã đăng nhập; không bao gồm chức năng quản trị hay thay đổi backend.

## Yêu cầu

- Dùng dữ liệu thật theo hợp đồng được xác nhận; không trình bày dữ liệu mẫu hoặc giá trị tự suy đoán như dữ liệu server.
- Chỉ tải dữ liệu khi phiên hợp lệ, sử dụng cơ chế access token và refresh hiện có. Tôn trọng quyền do server thực thi.
- Phân biệt đang tải, rỗng, lỗi có thể thử lại, không có quyền/không tìm thấy và phiên hết hạn. Không chuyển lỗi thành thành công rỗng; không chuyển trạng thái đang tải thành đăng xuất.
- Truyền định danh thực giữa danh sách, chi tiết và hành động; không giữ một đối tượng mẫu cố định cho mọi lựa chọn.
- Dữ liệu server thiếu trường UI: chỉ trình bày giá trị có nguồn hoặc hành vi đã được phê duyệt. Không lộ token, dữ liệu riêng hay chi tiết lỗi nội bộ.

## API dự kiến

Chưa xác nhận endpoint và quyền sinh viên; không suy đoán đường dẫn hoặc body. Đường dẫn là các endpoint được khảo sát, không phải xác nhận đầy đủ DTO, quyền hoặc hành vi runtime.

## Tiêu chí nghiệm thu

- Sinh viên chỉ thấy bài được phép; chọn bài mở đúng chi tiết, thời hạn và trạng thái có nguồn; dữ liệu rỗng/lỗi được hiển thị riêng.
- Với mạng lỗi, `403`, `404` và phiên hết hạn, trạng thái tương ứng được xử lý rõ ràng, không hiển thị thành công giả; có thể thử lại khi phù hợp.
- Màn hình hoạt động với dữ liệu rỗng và nội dung dài trên iOS/Android; không dùng dữ liệu demo như dữ liệu API.

## Câu hỏi mở / rủi ro triển khai

Cần xác định service, endpoint list/detail, quyền, mô hình lớp/khóa học, thời hạn, bài con và trạng thái hoàn thành. Chốt quy tắc nhóm Due Soon/Overdue/Completed và xử lý múi giờ theo hợp đồng; chưa thể hoàn thiện kế hoạch request trước khi có câu trả lời.

## Phụ thuộc

[Kiến trúc](../../../architecture/README.md), [quy trình](../../../../agent/working-agreement.md), phiên đăng nhập hiện có và hợp đồng backend tương ứng. Spec đã Approved; các câu hỏi trên vẫn là rủi ro cần đối chiếu với hợp đồng backend khi triển khai.
