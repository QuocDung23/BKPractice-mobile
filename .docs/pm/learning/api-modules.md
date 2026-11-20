# Đề xuất chia module nối API learning

Ngày: 2026-11-20  
Trạng thái: Đề xuất, chưa phải spec được duyệt.

Đối chiếu nhánh mobile hiện tại với `apps/learning-service` và gateway của repo backend. Các màn hình courses, problems, quiz và assignments đang dùng dữ liệu mẫu. Giữ các module mobile hiện có; không tạo thêm lớp hoặc dependency dùng chung khi chưa có nhu cầu thực tế.

| Thứ tự | Module | Phạm vi mobile | API cần đối chiếu |
| --- | --- | --- | --- |
| 1 | Courses | Danh sách và chi tiết khóa học, chương và nội dung được backend trả về. Thay `use-course-data`/`demo-courses`; truyền ID hoặc slug qua route. | `GET /api/courses`, `GET /api/courses/:idOrSlug`, `GET /api/progress/me/courses/:courseId` |
| 2 | Problems | Danh sách, lọc, chi tiết bài và trạng thái của người học. Thay `use-problem-data`/`demo-problems`; dùng ID hoặc slug thật. | `GET /api/problems`, `GET /api/problems/:idOrSlug`, `GET /api/progress/me/problems`, `GET /api/progress/me/problems/status` |
| 3 | Quiz | Xem quiz từ ID có sẵn, bắt đầu/lưu câu trả lời/kết thúc lần làm và xem kết quả, lịch sử. Thay `use-quiz-data`/`demo-quiz`; giữ ID quiz, attempt và question riêng. | `GET /api/quizzes/:id`, `GET /api/quizzes/:id/completion/me`, `POST /api/quizzes/:id/attempts`, `GET /api/quiz-attempts/me`, `GET /api/quiz-attempts/:id`, `PUT /api/quiz-attempts/:id/answers/:questionId`, `POST /api/quiz-attempts/:id/finish`, `GET /api/quiz-attempts/:id/result` |
| 4 | Submissions | Chạy/nộp bài và xem kết quả, tách khỏi đọc đề; backend thuộc submission-service. Chỉ triển khai các thao tác UI được duyệt. | `POST /api/run`, `POST /api/submissions`, `GET /api/submissions`, `GET /api/submissions/:publicId` |
| 5 | Assignments | Danh sách và chi tiết bài được giao, giữ module hiện có. | Cần xác minh nguồn API và quyền sinh viên trước khi chốt phạm vi. |
| 6 | Home | Các thẻ tổng hợp liên quan learning; chỉ nối sau khi xác định dữ liệu thực sự cần và nguồn tương ứng. | Dùng lại nghiệp vụ courses/progress hoặc API tổng hợp nếu được xác nhận. |

## Cách thực hiện từng module

Mỗi module cần `spec.md` được duyệt và `plan.md` tại `.docs/pm/specs/learning/<module>/` trước khi sửa `src/`. Spec xác định màn hình, quyền, trạng thái tải/rỗng/lỗi và các trường hiển thị; plan đối chiếu DTO, phân trang, lọc, route params, auth và cách kiểm thử với backend. Theo kiến trúc hiện tại: domain định nghĩa model và repository/use case cần thiết, `lib` chuyển response và gọi HTTP hiện có, hook nối dữ liệu/trạng thái với UI. Không dùng dữ liệu mẫu làm kết quả thành công khi API lỗi.

## Điểm cần chốt trước khi viết spec

- Course UI hiện có lesson, thời khóa biểu và giảng viên; cần xác nhận dữ liệu nào có thật trong course response và xử lý phần không được backend cung cấp. Không tự biến chapter/problem thành nội dung lesson.
- Quiz learner controller có API lấy quiz theo ID và lịch sử attempt; chưa thấy endpoint danh sách quiz cho người học trong controller đó. Cần xác định nguồn danh sách Assigned/Practice và ID để bắt đầu; lịch sử attempt không đồng nghĩa danh sách quiz.
- UI hiện có các giá trị mẫu như XP, tỷ lệ đúng, test case và trạng thái cố định. Chỉ hiển thị khi hợp đồng API thực sự cung cấp hoặc có quy tắc được duyệt; cần đối chiếu DTO và quyền truy cập cho từng màn hình.
- Assignments và phần lesson chưa xác định được hợp đồng từ các controller đã khảo sát; cần xác minh với backend trước khi cam kết tích hợp.
- Thống nhất module nào làm trước và phạm vi màn hình sinh viên để viết spec thực chất, thay vì tạo spec placeholder.

Nguồn kiểm tra: `apps/learning-service/src/modules/{courses,problems,progress,quizzes}/presentation/http`, `apps/submission-service/src/modules/{run-code,submissions}/presentation`, và `apps/api-gateway/src/application/proxy/gateway-proxy.constants.ts` trong repo backend; `src/{domain,hooks,lib,components}` trong mobile. Đây là bản phân chia ban đầu, chưa kiểm thử API đang chạy hoặc xác nhận toàn bộ DTO.
