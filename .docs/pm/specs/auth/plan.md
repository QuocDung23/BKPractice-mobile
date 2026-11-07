# MOB-AUTH-001 Kế hoạch triển khai

Trạng thái: Approved
Ngày: 2026-11-03

Đặc tả liên quan: [`./spec.md`](./spec.md) — Approved `1.0`.
Kế hoạch này chỉ triển khai các hành vi trong đặc tả đó. Nó không thêm yêu cầu, không thay đổi hợp
đồng backend, và không bao gồm công việc giảng viên, admin hay RBAC.

## Các lớp đích

Kho lưu trữ dùng sơ đồ Clean Architecture trong
[.docs/pm/architecture/README.md](../../architecture/README.md):

```text
app -> components -> hooks -> stores / domain / lib
lib -> domain
```

- `domain/auth/` giữ model, interface repository và use case. Không import Expo, React, HTTP hay
  storage.
- `lib/auth/` hiện thực các interface domain bằng axios client, secure token storage, helper PKCE
  Microsoft và ánh xạ response. Mã chạy thật nằm ở đây.
- `stores/auth-session.tsx` giữ state phiên dùng chung giữa các màn hình.
- `hooks/auth/` nối UI với use case và giữ state loading, error, navigation.
- `components/auth/` và `components/profile/` giữ toàn bộ UI màn hình.
- `app/` mỏng: chỉ ánh xạ route tới component gốc của module.

## Tầng domain

Tệp mới trong `src/domain/auth/`:

- `session.ts` — `AuthTokens { accessToken, refreshToken }`, `AuthUser { userId, studentId, roles, status }`,
  `SessionSnapshot { user, tokens }`.
- `profile.ts` — `Profile { userId, displayName, avatar, bio }`, `ProfileUpdate { displayName?, avatar?, bio? }`,
  `AvatarUploadIntent { avatar, uploadUrl, expiresInSeconds, headers }`.
- `password-reset.ts` — kiểu kết quả cho ba bước gửi, xác minh và đặt lại mật khẩu.
- `auth-failure.ts` — lỗi có kiểu, mang mã kiểu HTTP và thông báo an toàn cho người dùng.
- `auth-repository.ts` — interface để lớp `lib` hiện thực:
  - `signInWithPassword(identifier, password)`
  - `signInWithMicrosoft(loginCode, codeVerifier)`
  - `beginMicrosoftSignIn()` trả URL uỷ quyền và verifier, hoặc lỗi tường minh khi câu hỏi mở của
    đặc tả chưa được giải quyết
  - `refreshSession(refreshToken)`
  - `signOut(accessToken, refreshToken)`
  - `readCurrentUser(accessToken)`
- `profile-repository.ts` — `readMyProfile`, `updateMyProfile`, `createAvatarUploadIntent`.
- `password-reset-repository.ts` — `sendOtp`, `verifyOtp`, `resetPassword`.
- `session-store.ts` — interface lưu token: `read`, `write`, `clear`.
- Use case: `restoreSession`, `signIn`, `signOut`, `loadProfile`, `saveProfile`,
  `sendPasswordResetOtp`, `verifyPasswordResetOtp`, `resetPassword`.

Domain trả kết quả có kiểu và không bao giờ đọc HTTP thô hay storage trực tiếp.

## Tầng hạ tầng / lib

Tệp mới trong `src/lib/auth/`:

- `api-client.ts` — một axios wrapper:
  - đọc `EXPO_PUBLIC_API_BASE_URL`,
  - đặt timeout 15 giây cho mọi request,
  - thêm `X-Client-Type: mobile` cho các lời gọi auth và đặt lại mật khẩu,
  - thêm `Authorization: Bearer` cho lời gọi được bảo vệ,
  - ánh xạ response không phải 2xx thành lỗi có kiểu,
  - không bao giờ log header, body hay token.
- `secure-session-store.ts` — hiện thực `SessionStore` bằng `expo-secure-store`; chỉ cài bằng
  `npx expo install expo-secure-store` khi kế hoạch này được chấp nhận.
- `auth-repository.ts` — hiện thực interface auth domain theo các endpoint trong đặc tả.
- `profile-repository.ts` — hiện thực interface hồ sơ, gồm tải trực tiếp lên URL R2 đã ký.
- `password-reset-repository.ts` — hiện thực ba lời gọi OTP.
- `microsoft-pkce.ts` — tạo verifier 43 ký tự base64url và challenge S256 bằng `expo-crypto`.

Luồng Microsoft dùng lựa chọn (b) đã chốt: hook mở
`GET /api/auth/microsoft?client_type=mobile&code_challenge=<S256>` bằng `expo-web-browser`
`openAuthSessionAsync` với deep link `bkpracticemobile:///auth/callback`, nhận `loginCode`, rồi đổi
mã bằng `POST /api/auth/microsoft/exchange` với `X-Client-Type: mobile`. Verifier chỉ giữ trong bộ
nhớ. Backend ID-001 1.3 và Gateway cho phép deep link đã cấu hình.

## Store

`src/stores/auth-session.tsx` đổi từ `DemoSession | null` sang state phiên thật:

- `status: 'loading' | 'signedOut' | 'signedIn'`
- `session: SessionSnapshot | null`
- `setSession`, `clearSession`

Provider thực hiện phục hồi phiên lúc khởi động qua use case `restoreSession`. Nó không được sao
chép dữ liệu hồ sơ server vào store; màn hình hồ sơ đọc dữ liệu qua hook hồ sơ.

## Hooks

Thay `src/hooks/auth/use-demo-sign-in.ts` và các tệp demo:

- `use-sign-in.ts` — kiểm tra trường, gọi use case đăng nhập, ánh xạ lỗi thành một thông báo chung,
  và chuyển tới `/home` khi thành công.
- `use-session-restore.ts` — chạy một lần từ session provider và trả trạng thái phục hồi.
- `use-profile.ts` — tải `/api/profile/me`, trả `loading`, `error`, `profile`, `reload`.
- `use-update-profile.ts` — gửi chỉ các trường đã đổi; xử lý avatar intent và tải trực tiếp.
- `use-password-reset.ts` — giữ state ba bước gửi, xác minh, đặt lại và giới hạn gửi lại 60 giây.
- `use-microsoft-sign-in.ts` — giữ luồng PKCE và lần đổi mã dùng một lần.

Mỗi hook trả kiểu kết quả tường minh và không import chi tiết HTTP trực tiếp.

## Components và route

- `src/components/auth/sign-in-view.tsx` — thay hook demo bằng `useSignIn`; nối nút "Forgot
  password?" tới route đặt lại; giữ nguyên thiết kế hiện tại.
- Mới `src/components/auth/password-reset-view.tsx` — UI ba bước gửi, xác minh và đặt lại trong
  theme hiện có.
- Mới `src/components/auth/microsoft-sign-in-button.tsx` — chỉ khi luồng Microsoft được chấp nhận
  và được nối.
- `src/components/profile/profile-view.tsx` — gắn header, tên và avatar vào dữ liệu hồ sơ thật thay
  vì hằng số; thêm lối vào chỉnh sửa.
- Mới `src/components/profile/profile-edit-view.tsx` — sửa `displayName`, `bio` và avatar.
- `src/app/sign-in.tsx`, `src/app/forgot-password.tsx`, `src/app/profile-edit.tsx` — route mỏng
  render component gốc của module.
- `src/app/_layout.tsx` hoặc navigation root — chặn route được bảo vệ theo trạng thái phiên.

Xoá `src/domain/auth/demo-session.ts`, `src/lib/auth/demo-student.ts` và
`src/hooks/auth/use-demo-sign-in.ts` sau khi luồng thật thay thế chúng. Giữ nguyên dữ liệu demo khoá
học, bài tập và quiz vì chúng thuộc tính năng khác.

## API và dữ liệu

Dùng đúng endpoint, header và body trong bảng Đầu vào của đặc tả. Tên trường cố định:

- response auth: `userId`, `accessToken`, `refreshToken`
- người dùng hiện tại: `userId`, `studentId`, `roles`, `status`
- hồ sơ: `userId`, `displayName`, `avatar`, `bio`
- avatar intent: `avatar`, `uploadUrl`, `expiresInSeconds`, `headers`
- đặt lại mật khẩu: `resetToken` và `newPassword`

Ứng dụng không bao giờ gửi role, permission, status, tenant/object ID Microsoft hay header định
danh tin cậy.

## Cấu hình

- `EXPO_PUBLIC_API_BASE_URL` — base URL Gateway công khai, ví dụ `http://localhost:3000`.
- `EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL` — deep link công khai, mặc định
  `bkpracticemobile:///auth/callback`; phải khớp `AUTH_MOBILE_LOGIN_REDIRECT_URL` phía backend. Không
  có secret nào thuộc biến Expo công khai.
- Không thêm cấu hình runtime nào khác.

## Xử lý lỗi

- Phân tích body lỗi chuẩn của NestJS thành lỗi có kiểu mà không lộ chi tiết nội bộ.
- `401` trên lời gọi được bảo vệ kích hoạt một lần làm mới; thất bại lần hai xoá phiên.
- `503` hiển thị thông báo có thể thử lại và giữ phiên.
- Đăng nhập thất bại luôn hiển thị một thông báo chung.
- Đăng xuất thất bại vẫn xoá token cục bộ.

## Bảo mật

- Token chỉ trong `expo-secure-store`.
- Không token, mật khẩu, `resetToken`, OTP hay `loginCode` trong log/analytics; `loginCode` chỉ xuất
  hiện trong URL deep link một lần do backend tạo.
- PKCE verifier chỉ nằm trong bộ nhớ cho một luồng.
- Không secret trong biến `EXPO_PUBLIC_*`.
- Không xử lý cookie hay CSRF trong client mobile.

## Kiểm thử và kiểm tra

- Unit-test use case domain với repository giả: đăng nhập thành công/thất bại, phục hồi có làm mới,
  làm mới thất bại thì xoá phiên, lọc trường hồ sơ, thứ tự bước đặt lại.
- Unit-test ánh xạ response của lib với HTTP client được mock cho từng endpoint.
- Chạy `npx tsc --noEmit` và `npm run lint`.
- Kiểm tra thủ công: đăng nhập, phục hồi, làm mới, đăng xuất, đọc/cập nhật hồ sơ, tải avatar, đặt
  lại mật khẩu.

## Thứ tự triển khai

1. Thêm model, interface và use case domain.
2. Thêm API client, secure session store và repository ở lib.
3. Thay auth store bằng state phiên thật và phục hồi phiên.
4. Thay hook và view đăng nhập; xoá đường auth demo.
5. Thêm luồng đọc/cập nhật hồ sơ và avatar.
6. Thêm route, hook và UI đặt lại mật khẩu.
7. Nối luồng Microsoft chỉ sau khi câu hỏi mở của đặc tả được chốt.
8. Chạy typecheck và lint, rồi kiểm tra thủ công.
9. Viết work note dưới `.docs/worker/auth/`.

## Rủi ro

- Browser hệ thống không set được header bắt đầu Microsoft; câu hỏi mở của đặc tả phải được giải
  quyết trước khi code luồng đó.
- Hành vi redirect có thể khác nhau giữa các HTTP client; phải kiểm chứng trên Expo trước khi dựa
  vào nó.
- Refresh token xoay vòng có thể từ chối token cũ đang trên đường; ứng dụng chỉ được lưu cặp mới
  nhất.
- Cold start của deep link từ browser vẫn phải đổi mã dùng một lần trong 60 giây.

## Tuân thủ kiến trúc

- `domain` không import Expo, React, HTTP, store hay mã `lib`.
- `lib` hiện thực interface domain và sở hữu HTTP, secure storage, tích hợp nền tảng.
- `components` và `app` không gọi API trực tiếp; chúng dùng hook.
- `app/` mỏng và không chứa UI màn hình hay quy tắc nghiệp vụ.
- Không thêm mã admin, RBAC, giảng viên hay tìm kiếm công khai.