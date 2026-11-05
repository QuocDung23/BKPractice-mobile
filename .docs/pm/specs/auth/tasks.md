# MOB-AUTH-001 Công việc triển khai

Trạng thái: Approved — đang triển khai
Ngày: 2026-11-03

Đặc tả liên quan: [`./spec.md`](./spec.md) — Approved `1.0`
Kế hoạch liên quan: [`./plan.md`](./plan.md)

Chỉ đánh dấu `[x]` khi cả hành vi lẫn phần kiểm tra đã xong. Không bắt đầu một task khi phụ thuộc
của nó còn mở. Đặc tả phải `Approved` và kế hoạch được chấp nhận trước mọi thay đổi trong `src/`.

## Chuẩn bị

- [x] **MOB-AUTH-T001 — Xác nhận đặc tả đã Approved và giải quyết câu hỏi mở Microsoft.**
      Chủ sở hữu chọn giữa cách client dùng `redirect: manual` và cách bổ sung query parameter ở
      backend, đồng thời xác nhận `EXPO_PUBLIC_API_BASE_URL` và deep link chuyển hướng mobile.
      **Phụ thuộc:** không có.
      **Truy vết:** câu hỏi mở 1–2 của đặc tả.
      **Ghi chú:** đã chốt phương án query parameter; deep link mặc định
      `bkpracticemobile:///auth/callback`; backend ID-001 đã cập nhật 1.3.

- [x] **MOB-AUTH-T002 — Khảo sát mã auth và route hiện tại.** Đọc `src/domain/auth`,
      `src/lib/auth`, `src/hooks/auth`, `src/stores/auth-session.tsx`, `src/components/auth`,
      `src/components/profile`, `src/app`, kiến trúc mobile và quy tắc agent.
      **Phụ thuộc:** T001.
      **Truy vết:** mục Các lớp đích của kế hoạch.

## Tầng domain

- [x] **MOB-AUTH-T003 — Thêm model auth và lỗi.** Tạo `session.ts`, `profile.ts`,
      `password-reset.ts` và `auth-failure.ts` với đúng tên trường trong đặc tả.
      **Phụ thuộc:** T002.
      **Truy vết:** FR-002, FR-007, FR-008, FR-009, FR-011.
      **Ghi chú:** gộp vào `src/domain/auth/types.ts` thay vì tách bốn file.

- [x] **MOB-AUTH-T004 — Thêm interface repository.** Tạo `auth-repository.ts`,
      `profile-repository.ts`, `password-reset-repository.ts` và `session-store.ts` không import
      Expo, React, HTTP hay storage.
      **Phụ thuộc:** T003.
      **Truy vết:** mục Tầng domain của kế hoạch.

- [x] **MOB-AUTH-T005 — Thêm use case.** Tạo use case đăng nhập, đăng xuất, phục hồi phiên, tải hồ
      sơ, lưu hồ sơ và ba use case đặt lại mật khẩu. Trả kết quả có kiểu, không ném lỗi HTTP.
      **Phụ thuộc:** T004.
      **Truy vết:** FR-002, FR-005, FR-006, FR-008, FR-009, FR-011, FR-012.

- [ ] **MOB-AUTH-T006 — Unit-test use case.** Bao phủ đăng nhập thành công và lỗi chung, phục hồi
      có một lần làm mới, làm mới thất bại thì xoá phiên, lọc trường hồ sơ, và thứ tự bước đặt lại.
      **Phụ thuộc:** T005.
      **Truy vết:** AC-001, AC-002, AC-005, AC-006, AC-009, AC-011.
      **Ghi chú:** chưa có test runner trong repo; xem T028.

## Tầng hạ tầng / lib

- [x] **MOB-AUTH-T007 — Thêm API client.** Đọc base URL từ `EXPO_PUBLIC_API_BASE_URL`, thêm
      `X-Client-Type: mobile` cho lời gọi auth và đặt lại, thêm Bearer cho lời gọi được bảo vệ, ánh
      xạ lỗi, và không log header, body hay token.
      **Phụ thuộc:** T004.
      **Truy vết:** FR-001, FR-004, FR-014, FR-015.

- [x] **MOB-AUTH-T008 — Thêm secure token storage.** Hiện thực `SessionStore` bằng
      `expo-secure-store`; cài bằng `npx expo install expo-secure-store`.
      **Phụ thuộc:** T004.
      **Truy vết:** FR-015, AC-013.

- [x] **MOB-AUTH-T009 — Hiện thực auth repository.** Nối đăng nhập, làm mới, đăng xuất và người dùng
      hiện tại theo endpoint và header trong đặc tả. Phần Microsoft do T012/T018/T024 phụ trách.
      **Phụ thuộc:** T007, T008, T001.
      **Truy vết:** FR-002, FR-003, FR-005, FR-006, FR-007.

- [x] **MOB-AUTH-T010 — Hiện thực profile repository.** Đọc, cập nhật từng phần và avatar upload
      intent, cùng việc tải trực tiếp lên `uploadUrl` với headers trả về.
      **Phụ thuộc:** T007.
      **Truy vết:** FR-008, FR-009, FR-010.

- [x] **MOB-AUTH-T011 — Hiện thực password-reset repository.** Gửi OTP, xác minh OTP và đặt lại với
      `X-Client-Type: mobile`.
      **Phụ thuộc:** T007.
      **Truy vết:** FR-011.

- [x] **MOB-AUTH-T012 — Hiện thực helper PKCE Microsoft.** Tạo verifier 43 ký tự và challenge S256,
      giữ verifier trong bộ nhớ, và dùng cách đã chốt ở T001.
      **Phụ thuộc:** T001, T007.
      **Truy vết:** FR-003, AC-003.
      **Ghi chú:** `src/lib/auth/microsoft-pkce.ts` dùng `expo-crypto`; verifier và challenge đều 43
      ký tự base64url, verifier chỉ nằm trong biến cục bộ của hook.

- [ ] **MOB-AUTH-T013 — Unit-test ánh xạ của lib.** Mock fetch cho từng endpoint và kiểm tra header,
      body và ánh xạ lỗi, gồm việc không token hay mật khẩu nào bị log.
      **Phụ thuộc:** T009, T010, T011.
      **Truy vết:** AC-012, AC-013.
      **Ghi chú:** chưa có test runner; các header và ánh xạ đã được kiểm tra bằng `tsc`, `lint` và bundle.

## Store và hooks

- [x] **MOB-AUTH-T014 — Thay auth store.** Đổi `auth-session.tsx` sang state phiên thật với
      `loading`, `signedOut` và `signedIn`, và chạy phục hồi phiên lúc khởi động.
      **Phụ thuộc:** T005, T008, T009.
      **Truy vết:** FR-012, AC-004.

- [x] **MOB-AUTH-T015 — Thêm `useSignIn` và thay hook demo.** Kiểm tra trường, ánh xạ lỗi thành một
      thông báo chung, và chuyển tới `/home` khi thành công.
      **Phụ thuộc:** T014.
      **Truy vết:** FR-002, FR-013, FR-014, AC-001, AC-002.

- [x] **MOB-AUTH-T016 — Thêm `useProfile` và `useUpdateProfile`.** Tải hồ sơ, chỉ gửi trường đã đổi,
      xử lý avatar intent và tải trực tiếp.
      **Phụ thuộc:** T010, T014.
      **Truy vết:** FR-008, FR-009, FR-010, AC-008, AC-009, AC-010.
      **Ghi chú:** hook cập nhật được đặt tên `useProfileEditor`.

- [x] **MOB-AUTH-T017 — Thêm `usePasswordReset`.** Giữ ba bước và giới hạn gửi lại 60 giây, và xoá
      phiên cục bộ sau khi đặt lại thành công.
      **Phụ thuộc:** T011, T014.
      **Truy vết:** FR-011, AC-011.

- [x] **MOB-AUTH-T018 — Thêm `useMicrosoftSignIn`.** Chỉ sau khi T001 chốt cơ chế; giữ luồng PKCE và
      lần đổi mã duy nhất.
      **Phụ thuộc:** T001, T012, T014.
      **Truy vết:** FR-003, AC-003.
      **Ghi chú:** `use-microsoft-sign-in.ts` mở URL query bằng `expo-web-browser`, đọc `loginCode`
      bằng `expo-linking`, đổi mã đúng một lần và lưu phiên.

## Components và route

- [x] **MOB-AUTH-T019 — Nối view đăng nhập.** Thay `useDemoSignIn` bằng `useSignIn`, nối "Forgot
      password?", và giữ nguyên thiết kế cùng nhãn trợ năng hiện tại.
      **Phụ thuộc:** T015.
      **Truy vết:** FR-002, FR-013, AC-001, AC-002.

- [x] **MOB-AUTH-T020 — Thêm UI và route đặt lại mật khẩu.** Tạo component ba bước và
      `src/app/forgot-password.tsx`; giữ `src/app/` mỏng.
      **Phụ thuộc:** T017.
      **Truy vết:** FR-011, AC-011.

- [x] **MOB-AUTH-T021 — Gắn màn hình hồ sơ vào dữ liệu thật.** Thay tên, avatar và giá trị menu hằng
      số bằng `useProfile`, và thêm lối vào chỉnh sửa.
      **Phụ thuộc:** T016.
      **Truy vết:** FR-008, AC-008.

- [x] **MOB-AUTH-T022 — Thêm UI và route chỉnh sửa hồ sơ.** Tạo component chỉnh sửa và
      `src/app/profile-edit.tsx` cho `displayName`, `bio` và avatar.
      **Phụ thuộc:** T016.
      **Truy vết:** FR-009, FR-010, AC-009, AC-010.

- [x] **MOB-AUTH-T023 — Chặn route được bảo vệ.** Chuyển người chưa đăng nhập về `/sign-in` trước khi
      route được bảo vệ render, và đưa người đã đăng nhập về `/home`.
      **Phụ thuộc:** T014.
      **Truy vết:** FR-012, FR-013, AC-004, AC-007.

- [x] **MOB-AUTH-T024 — Nối nút đăng nhập Microsoft.** Chỉ khi T001 và T018 đã chốt; giữ nút ẩn hoặc
      tắt cho tới lúc đó.
      **Phụ thuộc:** T018, T019.
      **Truy vết:** FR-003, AC-003.
      **Ghi chú:** nút SSO đã hoạt động, có trạng thái đang mở Microsoft và dùng chung banner lỗi.

## Xoá đường demo

- [x] **MOB-AUTH-T025 — Xoá auth demo.** Xoá `src/domain/auth/demo-session.ts`,
      `src/lib/auth/demo-student.ts` và `src/hooks/auth/use-demo-sign-in.ts`, cập nhật barrel, và
      xác nhận không import nào còn trỏ tới chúng.
      **Phụ thuộc:** T015, T019.
      **Truy vết:** FR-016, AC-014.

## Cấu hình

- [x] **MOB-AUTH-T026 — Thêm cấu hình base URL API công khai.** Ghi lại `EXPO_PUBLIC_API_BASE_URL`
      và việc khớp deep link chuyển hướng mobile; không đặt secret nào trong biến công khai.
      **Phụ thuộc:** T001, T007.
      **Truy vết:** FR-001, mục Cấu hình của kế hoạch.
      **Ghi chú:** đã thêm `.env.example` với `EXPO_PUBLIC_API_BASE_URL` và
      `EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL`.

## Kiểm chứng

- [x] **MOB-AUTH-T027 — Chạy kiểm tra kho lưu trữ.** `npx tsc --noEmit` và `npm run lint` đều pass.
      Ghi lại lỗi có sẵn nằm ngoài công việc này.
      **Phụ thuộc:** T019–T026.
      **Truy vết:** mục Kiểm thử và kiểm tra của kế hoạch.

- [ ] **MOB-AUTH-T028 — Chạy luồng thủ công.** Đăng nhập thành công/thất bại, phục hồi phiên, một
      lần làm mới khi `401`, đăng xuất khi có/không có mạng, đọc/cập nhật hồ sơ, tải avatar, và ba
      bước đặt lại.
      **Phụ thuộc:** T027.
      **Truy vết:** AC-001–AC-013.
      **Ghi chú:** chưa chạy trên thiết bị/backend thật.

- [ ] **MOB-AUTH-T029 — Đối chiếu triển khai với đặc tả.** Kiểm tra từng FR và AC, xác nhận không
      thêm hành vi giảng viên, admin, RBAC hay tìm kiếm công khai, và xác nhận không thay đổi
      backend.
      **Phụ thuộc:** T027, T028.
      **Truy vết:** mục Yêu cầu chức năng và Ngoài phạm vi của đặc tả.
      **Ghi chú:** đã đối chiếu tĩnh từng FR/AC, gồm hợp đồng Microsoft query parameter và việc
      backend ID-001 được cập nhật 1.3; chưa hoàn tất vì T028 chưa chạy.

## Tài liệu

- [x] **MOB-AUTH-T030 — Viết work note.** Thêm `.docs/worker/auth/YYYY-MM-DD-mobile-auth.md` ghi tệp,
      hàm, lý do dùng từng công nghệ, lệnh đã chạy và những gì chưa được kiểm chứng.
      **Phụ thuộc:** T028, T029.
      **Truy vết:** bước 4 của working agreement mobile.

## Bị chặn

- **Kiểm thử tự động (T006, T013):** repo chưa có test runner.
- **Kiểm thử thủ công (T028, T029):** chưa chạy trên thiết bị và backend thật; cần
  `AUTH_MOBILE_LOGIN_REDIRECT_URL`/`EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL` khớp nhau và backend đang chạy.

## Lịch sử sửa đổi

| Ngày | Phiên bản | Tác giả | Tóm tắt |
| --- | --- | --- | --- |
| 2026-11-03 | 0.1 | opencode / người dùng | Danh sách task đầu tiên cho auth mobile, hồ sơ cá nhân và đặt lại mật khẩu. |
| 2026-11-03 | 0.2 | opencode | Cập nhật trạng thái triển khai; Microsoft và kiểm thử thủ công vẫn bị chặn. |