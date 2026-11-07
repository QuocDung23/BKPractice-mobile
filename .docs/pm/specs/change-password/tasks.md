# MOB-AUTH-002 Công việc triển khai

Trạng thái: Approved — đang triển khai  
Ngày: 2026-11-04

Đặc tả: [`./spec.md`](./spec.md) — Approved `1.0`  
Kế hoạch: [`./plan.md`](./plan.md) — Approved

Chỉ bắt đầu khi `spec.md` được Approved. Đánh dấu `[x]` khi cả hành vi lẫn phần kiểm tra đã xong.
Không mở task có phụ thuộc còn dang dở.

## Chuẩn bị

- [x] **MOB-AUTH-002-T001 — Duyệt spec và chốt ba quyết định giao diện.** Chủ sở hữu duyệt lối vào
      từ Profile, trường xác nhận mật khẩu mới, và việc giữ phiên sau khi đổi thành công.
      **Phụ thuộc:** không có.
      **Truy vết:** mục Câu hỏi mở của spec.

- [ ] **MOB-AUTH-002-T002 — Đối chiếu hợp đồng backend ID-008.** Xác nhận route, body, header,
      `204` và hành vi thu hồi phiên khác trên môi trường backend đang chạy.
      **Phụ thuộc:** T001.
      **Truy vết:** FR-002, FR-003, FR-005.

## Tầng domain

- [x] **MOB-AUTH-002-T003 — Thêm method repository.** Thêm `changeMyPassword` vào `AuthRepository`
      với ba tham số `accessToken`, `currentPassword`, `newPassword`; không import hạ tầng.
      **Phụ thuộc:** T001.
      **Truy vết:** FR-002.

- [x] **MOB-AUTH-002-T004 — Thêm mã lỗi và use case.** Thêm `invalid_current_password` vào
      `AuthFailureCode` và use case `changeMyPassword` trong `use-cases.ts`; export qua barrel.
      **Phụ thuộc:** T003.
      **Truy vết:** FR-006.

## Tầng hạ tầng / lib

- [x] **MOB-AUTH-002-T005 — Hiện thực request đổi mật khẩu.** Gọi
      `POST /api/auth/password/change` với Bearer, `X-Client-Type: mobile`, body hai trường và
      `expectEmpty`; không giữ `retryOnUnauthorized: false`.
      **Phụ thuộc:** T003.
      **Truy vết:** FR-002, FR-003, FR-005.

- [x] **MOB-AUTH-002-T006 — Ánh xạ `401`.** Trả thông báo "Your current password is incorrect." cho
      `invalid_current_password`; giữ nguyên thông báo đăng nhập của `invalid_credentials`.
      **Phụ thuộc:** T004, T005.
      **Truy vết:** FR-006, FR-007.

## Hook

- [x] **MOB-AUTH-002-T007 — Thêm `useChangePassword`.** Giữ ba trường mật khẩu, kiểm tra độ dài và
      khớp xác nhận, chặn submit lặp, gọi use case bằng phiên hiện tại, và không gọi `clearSession`
      khi `401`.
      **Phụ thuộc:** T004, T006.
      **Truy vết:** FR-004, FR-005, FR-006, FR-008, FR-009.

## Components, route và điều hướng

- [x] **MOB-AUTH-002-T008 — Thêm `ChangePasswordView`.** Form ba trường, trạng thái đang gửi, banner
      lỗi và khối thành công trong theme hiện có; export qua barrel `components/auth`.
      **Phụ thuộc:** T007.
      **Truy vết:** FR-004, FR-005, FR-008.

- [x] **MOB-AUTH-002-T009 — Thêm route và chặn quyền.** Tạo `src/app/change-password.tsx`, đăng ký
      `Stack.Screen`, và không thêm route vào `PUBLIC_ROUTES`.
      **Phụ thuộc:** T008.
      **Truy vết:** FR-001, FR-007.

- [x] **MOB-AUTH-002-T010 — Thêm lối vào từ Profile.** Thêm mục "Change password" vào `MENU` với
      href `/change-password`; không nối biểu tượng gear.
      **Phụ thuộc:** T009.
      **Truy vết:** FR-001.

## Kiểm chứng

- [x] **MOB-AUTH-002-T011 — Chạy typecheck và lint.** `npx tsc --noEmit` và `npm run lint` phải pass;
      ghi lại lỗi có sẵn nằm ngoài công việc này.
      **Phụ thuộc:** T005–T010.
      **Truy vết:** mục Kiểm thử và kiểm tra của kế hoạch.

- [ ] **MOB-AUTH-002-T012 — Chạy checklist thủ công.** Sai/đúng mật khẩu hiện tại, các lỗi validation,
      Unicode/khoảng trắng, access token hết hạn, refresh token bị thu hồi, và việc thiết bị khác bị
      đăng xuất.
      **Phụ thuộc:** T011 và backend ID-008 đang chạy.
      **Truy vết:** AC-001–AC-008.

- [ ] **MOB-AUTH-002-T013 — Đối chiếu spec và ghi work note.** Kiểm tra từng FR/AC, xác nhận không
      thêm dependency/cấu hình, rồi ghi `.docs/worker/auth/YYYY-MM-DD-change-password.md`.
      **Phụ thuộc:** T012.
      **Truy vết:** bước 4 của working agreement.

## Bị chặn

- **T002, T012:** cần backend Identity và Gateway đang chạy với route ID-008. Hợp đồng đã được đối
  chiếu tĩnh từ mã nguồn backend (route, DTO, `204`, chính sách thu hồi phiên, allowlist của
  Gateway), chưa xác nhận trên môi trường chạy.
- **T012–T013:** chưa có test runner tự động trong repo mobile. Work note đã ghi tại
  `.docs/worker/auth/2026-11-04-change-password.md`; T013 giữ mở cho tới khi T012 xong.

## Lịch sử sửa đổi

| Ngày | Phiên bản | Tác giả | Tóm tắt |
| --- | --- | --- | --- |
| 2026-11-04 | 0.1 | opencode / người dùng | Danh sách task đầu tiên cho đổi mật khẩu mobile. |
| 2026-11-04 | 1.0 | người dùng | Approved để triển khai. |
| 2026-11-04 | 1.1 | opencode | Đánh dấu T001, T003–T011 đã xong; ghi rõ T002 và T012–T013 còn bị chặn. |
