# Learning — Quiz

Trạng thái: Approved  
Ngày: 2026-11-20

## Mục tiêu và phạm vi

Mở quiz được phép theo ID, bắt đầu lượt làm, tải lại lượt, lưu lựa chọn, hoàn tất và xem kết quả/lịch sử của bản thân. Đối tượng là sinh viên đã đăng nhập; không bao gồm chức năng quản trị hay thay đổi backend.

## Yêu cầu

- Dùng dữ liệu thật theo hợp đồng được xác nhận; không trình bày dữ liệu mẫu hoặc giá trị tự suy đoán như dữ liệu server.
- Chỉ tải dữ liệu khi phiên hợp lệ, sử dụng cơ chế access token và refresh hiện có. Tôn trọng quyền do server thực thi.
- Phân biệt đang tải, rỗng, lỗi có thể thử lại, không có quyền/không tìm thấy và phiên hết hạn. Không chuyển lỗi thành thành công rỗng; không chuyển trạng thái đang tải thành đăng xuất.
- Truyền định danh thực giữa danh sách, chi tiết và hành động; không giữ một đối tượng mẫu cố định cho mọi lựa chọn.
- Dữ liệu server thiếu trường UI: chỉ trình bày giá trị có nguồn hoặc hành vi đã được phê duyệt. Không lộ token, dữ liệu riêng hay chi tiết lỗi nội bộ.

## API dự kiến

`GET /api/quizzes/:id`, `GET /api/quizzes/:id/completion/me`, `POST /api/quizzes/:id/attempts`, `GET /api/quiz-attempts/me`, `GET /api/quiz-attempts/:id`, `PUT /api/quiz-attempts/:id/answers/:questionId`, `POST /api/quiz-attempts/:id/finish`, `GET /api/quiz-attempts/:id/result`. Đường dẫn là các endpoint được khảo sát, không phải xác nhận đầy đủ DTO, quyền hoặc hành vi runtime.

## Tiêu chí nghiệm thu

- Bắt đầu đúng quiz, lưu lựa chọn đúng câu, khôi phục lượt đang làm, hoàn tất và hiển thị kết quả server; xử lý lỗi và trạng thái hết hạn/xung đột theo hợp đồng.
- Với mạng lỗi, `403`, `404` và phiên hết hạn, trạng thái tương ứng được xử lý rõ ràng, không hiển thị thành công giả; có thể thử lại khi phù hợp.
- Màn hình hoạt động với dữ liệu rỗng và nội dung dài trên iOS/Android; không dùng dữ liệu demo như dữ liệu API.

## Câu hỏi mở / rủi ro triển khai

Chi tiết course có thể chứa quiz theo chapter; cần xác nhận phạm vi hiển thị. Chưa xác định nguồn danh sách Assigned/Practice tổng quát cho sinh viên; lịch sử attempt không phải danh sách quiz. Xác nhận DTO, thời hạn, đáp án và feedback, quyền xem lại, và XP/timer trước khi triển khai.

## Phụ thuộc

[Kiến trúc](../../../architecture/README.md), [quy trình](../../../../agent/working-agreement.md), phiên đăng nhập hiện có và hợp đồng backend tương ứng. Spec đã Approved; các câu hỏi trên vẫn là rủi ro cần đối chiếu với hợp đồng backend khi triển khai.
