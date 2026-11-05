# MOB-AUTH-002 Kế hoạch triển khai

Trạng thái: Approved  
Ngày: 2026-11-04

Đặc tả liên quan: [`./spec.md`](./spec.md) — Approved `1.0`.  
Hợp đồng backend: [ID-008](../../../../../BKPractice-backend/.docs/specs/01-identity/change-password/spec.md)
— Approved `1.0`, đã triển khai `POST /api/auth/password/change` (204, Bearer bắt buộc).

Kế hoạch này chỉ nối UI mobile vào hành vi ID-008. Nó không thêm endpoint, không đổi backend và không
mở rộng sang quên mật khẩu hay quản trị người dùng.

## Các lớp đích

Theo [.docs/pm/architecture/README.md](../../architecture/README.md):

```text
app -> components -> hooks -> domain / lib
lib -> domain
```

- `domain/auth/` nhận thêm một method repository và một use case; không import Expo, React hay HTTP.
- `lib/auth/auth-repository.ts` gọi endpoint qua axios client dùng chung.
- `hooks/auth/use-change-password.ts` giữ state form, kiểm tra sớm và ánh xạ lỗi.
- `components/auth/change-password-view.tsx` giữ toàn bộ UI; `components/profile/profile-view.tsx`
  chỉ thêm lối vào.
- `app/change-password.tsx` là route mỏng.

## Tầng domain

Tệp sửa: `src/domain/auth/repositories.ts`

- Thêm vào `AuthRepository`:
  `changeMyPassword(accessToken: string, currentPassword: string, newPassword: string): Promise<void>`.
- Không thêm type mới: input là hai chuỗi, output là `void` (204).

Tệp sửa: `src/domain/auth/use-cases.ts`

- Thêm `changeMyPassword(auth, session, currentPassword, newPassword): Promise<void>`; gọi
  `auth.changeMyPassword(session.tokens.accessToken, ...)`.
- Không trim hay chuẩn hoá mật khẩu trong use case.

Tệp sửa: `src/domain/auth/types.ts`

- Thêm mã lỗi `invalid_current_password` vào `AuthFailureCode` để phân biệt "sai mật khẩu hiện tại"
  với "phiên hết hạn". Đây là mã phía client, backend vẫn trả `401`.

Tệp sửa: `src/domain/auth/index.ts`

- Export use case `changeMyPassword`; `AuthFailureCode` đã được export sẵn.

## Tầng hạ tầng / lib

Tệp sửa: `src/lib/auth/auth-repository.ts`

- Hiện thực `changeMyPassword` bằng `requestJson<void>`:
  - `path: "/api/auth/password/change"`
  - `method: "POST"`
  - `mobile: true` → `X-Client-Type: mobile` (bắt buộc, xem FR-003)
  - `accessToken` → `Authorization: Bearer`
  - `expectEmpty: true` → nhận `204`
  - `unauthorizedCode: "invalid_current_password"`
  - `body: { currentPassword, newPassword }`
  - giữ `retryOnUnauthorized` mặc định (`true`) để access token hết hạn vẫn được làm mới một lần rồi
    gửi lại.
- Không thêm file repository mới: đây là thao tác credential của chính phiên, cùng nhóm với
  `signIn`/`refresh`/`signOut`.

Tệp sửa: `src/lib/http/failure.ts`

- Trong nhánh `401`, trả thông báo riêng cho `invalid_current_password`:
  "Your current password is incorrect."
- Giữ nguyên thông báo chung của `invalid_credentials` dùng cho đăng nhập.

## Hook

Tệp mới: `src/hooks/auth/use-change-password.ts`

- State: `currentPassword`, `newPassword`, `confirmPassword`, `isSubmitting`, `error`, `isChanged`.
- Hàm setter xoá `error`; không trim giá trị mật khẩu.
- `submit(): Promise<boolean>` kiểm tra theo thứ tự:
  1. mật khẩu hiện tại rỗng → "Enter your current password."
  2. `newPassword.length` ngoài 8–128 → "Use a password between 8 and 128 characters."
  3. `newPassword === currentPassword` → "Choose a password different from your current one."
  4. `confirmPassword !== newPassword` → "The passwords do not match."
- Khi hợp lệ: gọi use case với `session` hiện tại; nếu không có session thì không gọi mạng.
- Khi thành công: đặt `isChanged = true` và xoá ba trường mật khẩu khỏi state.
- Khi lỗi: hiển thị `AuthFailure.message`, còn lại thông báo chung. **Không** gọi `clearSession` khi
  `401`, vì `401` ở route này thường là sai mật khẩu hiện tại (FR-006). Việc xoá phiên khi refresh
  thất bại đã do `setTokenRefresher` trong `use-session-restore.ts` đảm nhiệm (FR-007).
- Chặn submit lặp bằng `isSubmitting`.

Tệp sửa: `src/hooks/auth/index.ts` — export `useChangePassword`.

## Components, route và điều hướng

Tệp mới: `src/components/auth/change-password-view.tsx`

- Dùng `SafeAreaView`, `KeyboardAvoidingView`, `ScrollView` như `password-reset-view.tsx`.
- Header có nút quay lại, `BrandMark`, tiêu đề "Change password".
- Ba `InputField`: Current password, New password, Confirm new password; tất cả
  `secureTextEntry`, `autoCapitalize="none"`, `autoCorrect={false}`; current dùng
  `autoComplete="current-password"`, hai trường mới dùng `autoComplete="new-password"` và
  `textContentType="newPassword"`. Một nút hiện/ẩn dùng chung như màn hình reset.
- Dòng đếm ký tự cho mật khẩu mới; nút "Update password" với trạng thái đang gửi.
- Hiển thị `FeedbackBanner` cho lỗi.
- Khi `isChanged`: khối thành công (icon check), thông báo đã đổi và các thiết bị khác đã bị đăng
  xuất, nút "Back to profile".
- Quay lại: `router.back()` nếu `router.canGoBack()`, ngược lại `router.replace("/profile")`.
- Không chứa quy tắc nghiệp vụ hay gọi API trực tiếp; mọi thứ qua `useChangePassword`.

Tệp sửa: `src/components/auth/index.ts` — export `ChangePasswordView`.

Tệp mới: `src/app/change-password.tsx` — route mỏng render `ChangePasswordView`.

Tệp sửa: `src/components/navigation/root-navigation.tsx`

- Thêm `<Stack.Screen name="change-password" />`.
- Không thêm `"change-password"` vào `PUBLIC_ROUTES`, nhờ đó route guard hiện có chặn người chưa
  đăng nhập.

Tệp sửa: `src/components/profile/profile-view.tsx`

- Thêm một mục vào `MENU` ngay sau "Personal information":
  `{ ios: "lock", android: "lock", label: "Change password", value: "", href: "/change-password" }`.
- Không nối biểu tượng gear; không thêm màn hình Settings.

## API và dữ liệu

- Endpoint: `POST /api/auth/password/change`.
- Header: `Authorization: Bearer <accessToken>` và `X-Client-Type: mobile`.
- Body cố định: `currentPassword`, `newPassword`; không có `userId`, `confirmPassword`, token hay
  trường hồ sơ.
- Thành công `204`; lỗi `400/401/403/429/503`.
- Không lưu hay cache mật khẩu ở bất kỳ đâu.

## Xử lý lỗi

- `401` sau lần thử lại: `invalid_current_password` → "Your current password is incorrect."; không
  xoá phiên.
- Refresh thất bại: `setTokenRefresher` đã xoá secure store và gọi `clearSession`, route guard đưa
  về `/sign-in`. Thông báo lỗi trên màn hình không còn quan trọng.
- `400`: thông báo kiểm tra lại thông tin; client đã chặn phần lớn trường hợp.
- `403`: thông báo chung; thường là lỗi thiếu `X-Client-Type: mobile` khi tích hợp.
- `429`: "Too many attempts. Wait a moment and try again." (map sẵn).
- `503`/lỗi mạng: thông báo có thể thử lại, giữ nguyên phiên.

## Bảo mật

- Không log, không analytics, không `AsyncStorage`, không URL/deep link chứa mật khẩu.
- Không trim, không chuẩn hoá Unicode; gửi nguyên chuỗi người dùng nhập.
- Chỉ giữ mật khẩu trong state của hook và xoá ngay sau khi thành công.
- Input luôn che mặc định; nút hiện/ẩn có nhãn trợ năng.
- Không thêm secret hay biến `EXPO_PUBLIC_*` mới.

## Cấu hình

Không thay đổi. Dùng `EXPO_PUBLIC_API_BASE_URL` và session store hiện có.

## Kiểm thử và kiểm tra

Repo chưa có test runner, nên kiểm chứng bằng typecheck, lint và checklist thủ công:

1. Mở Profile → Change password; kiểm tra route bị chặn khi đã đăng xuất.
2. Sai mật khẩu hiện tại → lỗi đúng, vẫn đăng nhập, token không mất.
3. Mật khẩu mới hợp lệ → 204, xác nhận, về Profile, phiên còn.
4. Mật khẩu mới < 8, > 128, trùng mật khẩu hiện tại, xác nhận không khớp → chặn tại form.
5. Mật khẩu có khoảng trắng đầu/cuối và ký tự Unicode → vẫn hoạt động đúng.
6. Access token hết hạn, refresh token hợp lệ → tự làm mới một lần rồi thành công.
7. Refresh token bị thu hồi → về đăng nhập.
8. Đổi mật khẩu trên thiết bị A → thiết bị B bị đăng xuất; A vẫn dùng được và refresh được.
9. Kiểm tra log/network không có mật khẩu hay token trong URL.
10. Chạy `npx tsc --noEmit` và `npm run lint`.

## Thứ tự triển khai

1. Duyệt `spec.md` và chốt ba câu hỏi mở.
2. Thêm method repository, mã lỗi và use case ở domain.
3. Hiện thực repository ở lib và ánh xạ `401`.
4. Thêm hook `useChangePassword`.
5. Thêm view, route, đăng ký Stack và lối vào Profile.
6. Chạy typecheck, lint.
7. Kiểm tra thủ công với backend ID-008 đang chạy.
8. Viết work note tại `.docs/worker/auth/YYYY-MM-DD-change-password.md`.

## Rủi ro

- **401 dùng chung:** backend trả cùng `401` cho sai mật khẩu hiện tại và token không hợp lệ. Kế
  hoạch dựa vào việc làm mới token trước khi kết luận; client chặn trước trường hợp
  `newPassword === currentPassword` để thông báo "sai mật khẩu hiện tại" đúng ngữ cảnh.
- **Refresh không cần thiết:** mỗi lần gõ sai mật khẩu hiện tại có thể xoay refresh token một lần.
  Chấp nhận để đổi lấy khả năng tự phục hồi khi access token hết hạn.
- **Thiếu header mobile:** quên `mobile: true` sẽ khiến Identity coi là request web và trả `403` do
  không có Origin. Đây là lỗi dễ xảy ra khi copy request từ endpoint public.
- **Xoá phiên sai chỗ:** nếu hook xử lý `401` giống `useProfileEditor`, người dùng gõ sai mật khẩu sẽ
  bị đăng xuất oan. Kế hoạch cấm gọi `clearSession` trong hook này.
- **Không trim:** trim mật khẩu sẽ làm người dùng không đăng nhập lại được bằng đúng chuỗi đã đặt.

## Tuân thủ kiến trúc

- `domain` chỉ thêm interface và use case thuần TypeScript.
- `lib` sở hữu HTTP và ánh xạ lỗi; `hooks` sở hữu state form; `components` chỉ hiển thị.
- `app/change-password.tsx` mỏng, không chứa UI hay quy tắc.
- Không thêm dependency, không đổi backend, không mở rộng sang admin hay quên mật khẩu.
