# Change password

Date: 2026-11-04
Spec: .docs/pm/specs/change-password/spec.md (Approved)
Plan: .docs/pm/specs/change-password/plan.md

## What was done

- `src/domain/auth/types.ts` — thêm `invalid_current_password` vào `AuthFailureCode` để tách lỗi sai
  mật khẩu hiện tại khỏi phiên hết hạn (FR-006).
- `src/domain/auth/repositories.ts` — thêm `changeMyPassword` vào `AuthRepository`, chỉ nhận
  `accessToken`, `currentPassword`, `newPassword` (FR-002).
- `src/domain/auth/use-cases.ts` và `src/domain/auth/index.ts` — thêm và export use case
  `changeMyPassword` (FR-002, FR-010).
- `src/lib/auth/auth-repository.ts` — hiện thực `POST /api/auth/password/change` với Bearer token,
  `mobile: true` (tức `X-Client-Type: mobile`), body hai trường và `expectEmpty` cho `204`
  (FR-002, FR-003, FR-005).
- `src/lib/http/failure.ts` — ánh xạ `401` của route này thành "Your current password is incorrect.";
  giữ nguyên thông báo của `invalid_credentials` (FR-006, FR-007).
- `src/hooks/auth/use-change-password.ts` và `src/hooks/auth/index.ts` — thêm hook form: kiểm tra phía
  client, chặn submit lặp, gọi use case bằng phiên hiện tại, không `clearSession` khi `401`
  (FR-004, FR-005, FR-006, FR-008, FR-009).
- `src/components/auth/change-password-view.tsx` và `src/components/auth/index.ts` — màn hình ba
  trường, trạng thái đang gửi, banner lỗi và khối thành công theo palette hiện có
  (FR-005, FR-008).
- `src/app/change-password.tsx` — route mỏng trả về `ChangePasswordView` (FR-001).
- `src/components/navigation/root-navigation.tsx` — đăng ký `Stack.Screen name="change-password"`;
  route không nằm trong `PUBLIC_ROUTES` nên vẫn được bảo vệ (FR-001).
- `src/components/profile/profile-view.tsx` — thêm dòng "Change password" với icon khoá ngay sau
  "Personal information" (FR-001).
- `.docs/pm/specs/change-password/tasks.md` — đánh dấu các task đã xong.

## Functions

### `changeMyPassword` — `src/domain/auth/use-cases.ts`

- What it does: chuyển phiên hiện tại và hai chuỗi mật khẩu xuống repository.
- Input: `AuthRepository`, `AuthSession`, `currentPassword`, `newPassword`.
- Output: `Promise<void>`.
- Why it is written this way: giữ domain không biết HTTP, không trim hay chuẩn hoá mật khẩu, và chỉ
  lấy access token từ phiên thay vì cho component tự ghép header.

### `httpAuthRepository.changeMyPassword` — `src/lib/auth/auth-repository.ts`

- What it does: gọi `POST /api/auth/password/change` và coi `204` là thành công.
- Input: `accessToken`, `currentPassword`, `newPassword`.
- Output: `Promise<void>`.
- Why it is written this way: dùng lại `requestJson` nên có sẵn refresh-một-lần, timeout và ánh xạ lỗi;
  `mobile: true` là bắt buộc vì thiếu `X-Client-Type` thì Identity trả `403`.

### `apiFailureFor` — `src/lib/http/failure.ts`

- What it does: với `401` trên route đổi mật khẩu, trả `AuthFailure("invalid_current_password", ...)`
  mang thông báo sai mật khẩu hiện tại.
- Input: status, `unauthorizedCode`, message từ server.
- Output: `AuthFailure`.
- Why it is written this way: `401` ở đây không có nghĩa phiên chết, nên mã lỗi riêng giúp hook không
  xoá phiên mà vẫn để cơ chế refresh dùng chung xử lý trường hợp refresh thật sự thất bại.

### `useChangePassword` — `src/hooks/auth/use-change-password.ts`

- What it does: giữ ba trường mật khẩu, chạy validation (rỗng, 8–128, khác mật khẩu hiện tại, khớp xác
  nhận), chặn submit lặp, gọi use case và trả lỗi/trạng thái cho màn hình.
- Input: không có; đọc phiên qua `useAuthSession`.
- Output: `ChangePasswordState` gồm giá trị, setter, `isSubmitting`, `error`, `isChanged`, `submit`.
- Why it is written this way: `submit` trả `Promise<void>` vì màn hình chỉ cần state; cờ `isMounted`
  giữ đúng edge case "kết quả trả về muộn không được ghi đè màn hình khác" trong spec.

### `ChangePasswordView` — `src/components/auth/change-password-view.tsx`

- What it does: render form ba trường (mật khẩu hiện tại, mật khẩu mới, xác nhận), nút hiện/ẩn mật
  khẩu, nút gửi có loading, banner lỗi, và khối thành công "Other devices have been signed out".
- Props: không có.
- Why it is written this way: dùng `InputField`, `FeedbackBanner`, `BrandMark` và token màu sẵn có để
  khớp các màn hình auth khác; thành công không đăng xuất mà chỉ quay về Profile.

### `ChangePasswordRoute` — `src/app/change-password.tsx`

- What it does: nối route `/change-password` với `ChangePasswordView`.
- Props: không có.
- Why it is written this way: route chỉ khai báo theo quy ước Expo Router, UI nằm ngoài `src/app/`.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| Expo Router | `src/app/change-password.tsx`, `src/components/navigation/root-navigation.tsx` | Route được bảo vệ theo kiến trúc hiện có. |
| `expo-symbols` | `src/components/auth/change-password-view.tsx` | Icon khoá, mắt và dấu xác nhận, cùng cách các màn hình auth khác đang dùng. |
| NativeWind classes + `Brands` tokens | `src/components/auth/change-password-view.tsx` | Giữ đúng palette trong `.docs/UI/theme-color.md`, không thêm style mới. |
| `requestJson` hiện có | `src/lib/auth/auth-repository.ts` | Tái dùng axios client, refresh token và ánh xạ lỗi; không thêm thư viện hay cấu hình. |

## Checks

- `npx tsc --noEmit`: pass, không có output.
- `npm run lint`: pass; chỉ in hai dòng `env: load/export` của Expo.

## Left undone

- Chưa chạy checklist thủ công T012: cần Identity và Gateway đang chạy với route ID-008, và repo mobile
  chưa có test runner tự động.
- Sai mật khẩu hiện tại vẫn có thể xoay refresh token một lần qua cơ chế refresh dùng chung; đã ghi
  nhận là trade-off chấp nhận được trong spec, không sửa trong task này.
- Biểu tượng gear trên Profile vẫn chưa có hành vi, nằm ngoài phạm vi spec.
