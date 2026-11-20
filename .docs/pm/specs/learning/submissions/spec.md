# Learning — Chạy và nộp bài

Trạng thái: Draft  
Ngày: 2026-11-20

## Mục tiêu và phạm vi

Chạy thử, nộp mã bài lập trình và xem trạng thái/kết quả bài nộp của sinh viên theo hợp đồng submission-service. Đối tượng là sinh viên đã đăng nhập; không bao gồm chức năng quản trị hay thay đổi backend.

## Yêu cầu

- Dùng dữ liệu thật theo hợp đồng được xác nhận; không trình bày dữ liệu mẫu hoặc giá trị tự suy đoán như dữ liệu server.
- Chỉ tải dữ liệu khi phiên hợp lệ, sử dụng cơ chế access token và refresh hiện có. Tôn trọng quyền do server thực thi.
- Phân biệt đang tải, rỗng, lỗi có thể thử lại, không có quyền/không tìm thấy và phiên hết hạn. Không chuyển lỗi thành thành công rỗng; không chuyển trạng thái đang tải thành đăng xuất.
- Truyền định danh thực giữa danh sách, chi tiết và hành động; không giữ một đối tượng mẫu cố định cho mọi lựa chọn.
- Dữ liệu server thiếu trường UI: chỉ trình bày giá trị có nguồn hoặc hành vi đã được phê duyệt. Không lộ token, dữ liệu riêng hay chi tiết lỗi nội bộ.

## API dự kiến

`POST /api/run`, `POST /api/submissions`, `GET /api/submissions`, `GET /api/submissions/:publicId`. Đường dẫn là các endpoint được khảo sát, không phải xác nhận đầy đủ DTO, quyền hoặc hành vi runtime.

## Tiêu chí nghiệm thu

- Chạy thử/nộp đúng bài với mã và ngôn ngữ hợp lệ; không gửi trùng khi đang xử lý; trạng thái đang chờ, kết quả và lỗi được biểu diễn đúng, không giả Accepted.
- Với mạng lỗi, `403`, `404` và phiên hết hạn, trạng thái tương ứng được xử lý rõ ràng, không hiển thị thành công giả; có thể thử lại khi phù hợp.
- Màn hình hoạt động với dữ liệu rỗng và nội dung dài trên iOS/Android; không dùng dữ liệu demo như dữ liệu API.

## Câu hỏi cần chốt trước khi duyệt

Chốt phạm vi UI nhập mã, lựa chọn ngôn ngữ, chạy thử so với nộp, cơ chế cập nhật trạng thái, giới hạn và xử lý khi kết quả request không chắc chắn; đối chiếu DTO, quyền và gateway. Không tự động thử lại thao tác tạo khi có thể tạo bản nộp trùng.

## Phụ thuộc

[Kiến trúc](../../../architecture/README.md), [quy trình](../../../../agent/working-agreement.md), phiên đăng nhập hiện có và hợp đồng backend tương ứng. Spec này chưa Approved; các câu hỏi trên phải được giải quyết trước khi cho phép sửa `src/`.
