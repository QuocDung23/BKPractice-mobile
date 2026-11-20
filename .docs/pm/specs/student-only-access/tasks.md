# MOB-AUTH-004 Checklist giới hạn mobile cho sinh viên

Trạng thái: Approved — chưa triển khai source  
Ngày: 2026-11-07

Đặc tả: [spec.md](./spec.md) — Approved 1.0. Kế hoạch: [plan.md](./plan.md).
T001 đã xong; các task còn lại triển khai trong phạm vi spec và plan.

- [x] **SA-T001 — Duyệt yêu cầu và mở gate.** Người dùng duyệt chính sách có `STUDENT`, kể cả
  nhiều vai trò, thông báo dùng web và phạm vi mobile. Chuyển spec sang Approved sau xác nhận;
  bổ sung tham chiếu/ngoại lệ thông báo trong auth spec và plan cho thống nhất. Đọc architecture,
  agent rules, kiểm tra tình trạng MOB-AUTH-003 và docs Expo khớp SDK trước khi sửa API nền tảng.
  **Phụ thuộc:** không có. **Truy vết:** spec mục Quyết định đã duyệt; plan mục 6.
  **Đã xong 2026-11-07:** spec/plan/tasks chuyển Approved; auth spec/plan đã tham chiếu MOB-AUTH-004;
  architecture và agent rules đã đọc; MOB-AUTH-003 vẫn Draft nên giữ nguyên phạm vi; Expo SDK 58
  được xác nhận từ `package.json`, docs phiên bản sẽ đọc trước khi chạm API nền tảng.

- [ ] **SA-T002 — Regression test trước sửa.** Dùng runner sẵn có hoặc `node:test` và TypeScript,
  repository/storage giả. Tái hiện việc nhận phiên thiếu `STUDENT` và ghi token trước `/me`.
  Không cài dependency mới mặc định; test phải gọi code sản phẩm.
  **Phụ thuộc:** T001. **Truy vết:** SA-AC-001–005; plan mục 5.

- [ ] **SA-T003 — Chặn ở domain và ranh giới response.** Thêm lỗi `mobile_access_denied`, kiểm
  tra cấu trúc `roles` tại repository và quy tắc `STUDENT` dùng chung ở domain. Sửa mật khẩu và
  Microsoft xác nhận trước lưu token/nhận phiên. Dọn phiên bị loại và thử logout, giữ lỗi gốc.
  **Phụ thuộc:** T002. **Truy vết:** SA-FR-001/002/005/007/009; SA-AC-001–005/010/012.

- [ ] **SA-T004 — Đóng đường restore và refresh.** Áp dụng điều kiện cho token lưu từ bản cũ;
  sau refresh đọc `/me`, kiểm tra userId và vai trò mới trước commit/retry. Tắt HTTP tự refresh
  cho request xác nhận `/me`; không nuốt lý do thiếu quyền trong catch của restore/refresh.
  **Phụ thuộc:** T003. **Truy vết:** SA-FR-003/004/005/007; SA-AC-006–010.

- [ ] **SA-T005 — Thông báo và chặn navigation.** Nối lỗi đăng nhập, restore và refresh vào banner;
  quản lý lý do tạm thời, reset đúng lúc. Màn hình bảo vệ không mount khi chưa xác nhận/bị loại.
  Xử lý storage lỗi có thử lại, bảo vệ completion/cleanup cũ khỏi tác động phiên mới.
  **Phụ thuộc:** T003, T004. **Truy vết:** SA-FR-005/006/008; SA-AC-010/011/013.

- [ ] **SA-T006 — Hoàn tất kiểm tra tự động.** Bao phủ SA-AC-001–013 bằng test phù hợp, gồm thứ
  tự `/me` trước ghi token, logout/storage lỗi, request refresh không lặp và phản hồi đến muộn.
  Chạy regression test, `npx tsc --noEmit`, `npm run lint`; ghi lỗi có sẵn ngoài phạm vi nếu có.
  **Phụ thuộc:** T003–T005. **Truy vết:** toàn bộ AC; plan mục 5.

- [ ] **SA-T007 — Kiểm thử thực tế iOS và Android.** Chạy password/SSO với `STUDENT`, `ADMIN`,
  `LECTURER` và nhiều role; thử phiên cũ, bỏ `STUDENT` rồi refresh, deep link tới route bảo vệ
  và thông báo lỗi. Ghi môi trường, thiết bị/build, kết quả, không ghi credential/token thật.
  Thiếu môi trường hoặc tài khoản test thì để task mở, không thay bằng test mock.
  **Phụ thuộc:** T006. **Truy vết:** SA-AC-001–013.

- [ ] **SA-T008 — Work note và trạng thái.** Sau mỗi lượt sửa source, ghi file/hàm/công nghệ,
  lý do thay đổi và lệnh kiểm tra ở `.docs/worker/auth/YYYY-MM-DD-student-only-access.md`.
  Cập nhật checklist theo bằng chứng thực tế; chỉ đóng toàn bộ khi T006 và T007 hoàn tất.
  **Phụ thuộc để đóng:** T006, T007. **Truy vết:** working agreement; plan mục 6.

## Lịch sử sửa đổi

| Ngày | Phiên bản | Tác giả | Tóm tắt |
| --- | --- | --- | --- |
| 2026-11-07 | 0.1 | opencode / người dùng | Danh sách task đầu tiên cho giới hạn ứng dụng mobile dành cho sinh viên. |
| 2026-11-07 | 1.0 | người dùng | Approved; T001 hoàn tất, các task triển khai còn mở. |
