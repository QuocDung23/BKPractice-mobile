# Công việc — Bảng xếp hạng XP trên mobile

Trạng thái: Draft — chưa được duyệt để triển khai.  
Ngày: 2026-11-26

Đặc tả liên quan: [spec.md](./spec.md) — Draft.  
Kế hoạch liên quan: [plan.md](./plan.md) — Draft.

Chỉ bắt đầu task sửa `src/` sau khi spec được Approved và plan được chấp nhận. Chỉ đánh dấu `[x]`
khi cả hành vi và kiểm tra tương ứng đã xong.

## Chuẩn bị

- [ ] **MOB-RANK-T001 — Duyệt phạm vi và giải quyết câu hỏi mở.** Xác nhận bảng toàn trường tuần/tháng
  là phạm vi đầu; quyết định có bỏ filter `My class`, `Faculty`, `All time` và dòng tăng hạng từ mock.
  Nếu cần các phạm vi đó, cập nhật/duyệt hợp đồng backend trước khi code.  
  **Phụ thuộc:** không có. **Truy vết:** câu hỏi mở của spec.
- [ ] **MOB-RANK-T002 — Khóa hợp đồng và khảo sát điểm nối mobile.** Đối chiếu backend spec,
  controller, logic, gateway; đọc `src/lib/http`, `src/lib/learning`, `useLearningRequest`, màn Ranking
  và component trạng thái/pagination đang có.  
  **Phụ thuộc:** T001. **Truy vết:** hợp đồng API, plan.

## Domain và lib

- [ ] **MOB-RANK-T003 — Thêm model/interface ranking.** Định nghĩa kỳ `week|month`, entry, response
  và repository contract trong `src/domain/ranking/`; giữ domain độc lập với UI và HTTP.  
  **Phụ thuộc:** T002. **Truy vết:** FR-003–005.
- [ ] **MOB-RANK-T004 — Thêm repository đọc leaderboard.** Gọi endpoint với Bearer qua `fetchLearning`,
  gửi `period`, `page`, `limit=10` và decode response từ `unknown`; ánh xạ shape sai thành lỗi
  response hiện hành.  
  **Phụ thuộc:** T003. **Truy vết:** FR-001, FR-003, FR-004, FR-006.
- [ ] **MOB-RANK-T005 — Thêm use case và public barrel.** Cung cấp thao tác tải trang nếu phù hợp với
  pattern module hiện hành; chỉ export phần API domain/lib được module khác sử dụng.  
  **Phụ thuộc:** T003–T004. **Truy vết:** architecture, plan.

## Hook và UI

- [ ] **MOB-RANK-T006 — Thêm hook trạng thái Ranking.** Dùng `useLearningRequest` và key theo phiên,
  kỳ, trang; cung cấp retry và không để response cũ xuất hiện sau khi user/kỳ/trang đổi.  
  **Phụ thuộc:** T005. **Truy vết:** FR-001, FR-002, FR-006, FR-008.
- [ ] **MOB-RANK-T007 — Nối dữ liệu thật vào màn Ranking.** Loại bỏ `LEADERS`, `ROWS` và filter giả;
  render trường response, fallback initials, Top 3, trang danh sách và vị trí người xem đúng một lần.
  Không hiện `userId` hay dữ liệu demo.  
  **Phụ thuộc:** T006. **Truy vết:** FR-004, FR-005, FR-008, FR-009.
- [ ] **MOB-RANK-T008 — Thêm chọn kỳ và điều hướng trang.** Mặc định tuần; đổi tuần/tháng về trang
  1; gửi pager theo `totalItems`/`limit` và dùng page backend trả về.  
  **Phụ thuộc:** T006–T007. **Truy vết:** FR-002, FR-003.
- [ ] **MOB-RANK-T009 — Hoàn thiện loading, error, empty và retry.** Phân biệt bảng rỗng thật với lỗi;
  xử lý 401 qua session hiện có, 403 không có quyền, lỗi mạng/5xx có thể thử lại, avatar null và
  response Top 3 ngắn.  
  **Phụ thuộc:** T006–T008. **Truy vết:** FR-006, FR-007.

## Kiểm chứng

- [ ] **MOB-RANK-T010 — Kiểm tra hợp đồng và trạng thái.** Bao phủ query, decode, kỳ tuần/tháng, Top 3,
  page đầu/cuối, `me` null/ngoài trang, lỗi/empty và đổi user; không tạo test runner/dependency mới
  nếu repo chưa có.  
  **Phụ thuộc:** T004–T009. **Truy vết:** AC-001–010.
- [ ] **MOB-RANK-T011 — Chạy kiểm tra repo và xem trên thiết bị.** Chạy `npx tsc --noEmit`,
  `npm run lint`; kiểm tra màn hình trên iOS/Android với backend khả dụng và ghi rõ phần chưa thể
  chạy.  
  **Phụ thuộc:** T010. **Truy vết:** plan, workflow.
- [ ] **MOB-RANK-T012 — Ghi work note.** Viết `.docs/worker/ranking/YYYY-MM-DD-<task>.md` theo template,
  ghi tệp/hàm/công nghệ, lệnh kiểm tra và phần chưa kiểm chứng.  
  **Phụ thuộc:** T011. **Truy vết:** working agreement.
