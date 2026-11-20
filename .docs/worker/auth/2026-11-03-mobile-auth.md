# Xác thực mobile, hồ sơ cá nhân và đặt lại mật khẩu

Ngày: 2026-11-03
Spec: .docs/pm/specs/auth/spec.md (Approved)
Kế hoạch: .docs/pm/specs/auth/plan.md

## Đã làm

- `src/domain/auth/types.ts` — thêm mô hình phiên, hồ sơ, avatar, đặt lại mật khẩu và lỗi dùng bởi FR-002, FR-005–FR-012.
- `src/domain/auth/repositories.ts` — thêm cổng (port) auth, hồ sơ, đặt lại mật khẩu và lưu trữ phiên bảo mật; không import Expo, React, HTTP hay bộ nhớ lưu trữ.
- `src/domain/auth/use-cases.ts` — thêm use case typed cho đăng nhập, trao đổi mã Microsoft, làm mới, khôi phục phiên, đăng xuất, đọc/cập nhật hồ sơ, tải avatar và ba bước đặt lại mật khẩu (FR-003, FR-005, FR-006, FR-008–FR-012).
- `src/domain/auth/index.ts` — công khai API công khai của tầng domain.
- `src/domain/home/home-data.ts`, `src/domain/home/index.ts` — chuyển mô hình hiển thị Home ra khỏi mô hình phiên demo đã xóa, để Home giữ nội dung demo mà không giữ đường đăng nhập demo (FR-016).
- `src/lib/auth/config.ts` — đọc `EXPO_PUBLIC_API_BASE_URL` và `EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL` với giá trị mặc định phát triển (FR-001, FR-003).
- `src/lib/auth/api-client.ts` — yêu cầu JSON, tiêu đề mobile, truy cập Bearer, ánh xạ lỗi, làm mới và thử lại một lần trên `401` được bảo vệ, và không ghi log token (FR-001, FR-004, FR-005, FR-014, FR-015, AC-005).
- `src/lib/auth/secure-session-store.ts` — triển khai `SessionStore` bằng `expo-secure-store` (FR-015, AC-013).
- `src/lib/auth/auth-repository.ts` — gọi đăng nhập mật khẩu, trao đổi mã Microsoft, làm mới, `/auth/me` và đăng xuất (FR-002, FR-003, FR-005, FR-006, FR-007).
- `src/lib/auth/microsoft-pkce.ts` — tạo verifier 43 ký tự base64url và thách thức S256 bằng `expo-crypto`; verifier chỉ ở trong bộ nhớ của hook (FR-003, AC-003).
- `src/lib/auth/profile-repository.ts` — đọc/cập nhật hồ sơ, tạo ý định tải avatar và tải ảnh trực tiếp lên URL đã ký (FR-008–FR-010).
- `src/lib/auth/password-reset-repository.ts` — gọi gửi OTP, xác minh OTP và đặt lại với tiêu đề mobile (FR-011).
- `src/lib/auth/index.ts` — nối các kho lưu trữ và lưu trữ bảo mật vào gốc cấu thành của ứng dụng.
- `src/lib/home/demo-home.ts`, `src/lib/home/index.ts` — giữ các giá trị demo của Home sau khi xóa phiên demo.
- `src/lib/profile/initials.ts`, `src/lib/profile/index.ts` — phần rút gọn tên avatar dùng chung.
- `src/hooks/auth/use-session-restore.ts` — khôi phục phiên khi khởi động và đăng ký callback làm mới dùng bởi API client (FR-012, AC-004, AC-005).
- `src/hooks/auth/use-sign-in.ts` — xác thực đầu vào, giữ thông báo lỗi đăng nhập chung và điều hướng về Home khi thành công (FR-002, FR-013, FR-014).
- `src/hooks/auth/use-microsoft-sign-in.ts` — tạo PKCE, mở URL khởi động Microsoft có tham số truy vấn bằng `expo-web-browser`, đọc `loginCode` bằng `expo-linking`, trao đổi một lần và lưu phiên (FR-003, AC-003).
- `src/hooks/auth/use-sign-out.ts` — gọi use case đăng xuất, luôn xóa trạng thái cục bộ kể cả khi mạng lỗi (FR-006, AC-007).
- `src/hooks/auth/use-profile.ts` — đọc hồ sơ máy chủ, thử lại khi focus và đăng xuất khi phiên bị từ chối (FR-008, AC-008).
- `src/hooks/auth/use-profile-editor.ts` — sửa tên hiển thị/bio, chọn hình, tạo ý định tải, tải ảnh và gửi tham chiếu avatar đã trả về (FR-009, FR-010, AC-009, AC-010).
- `src/hooks/auth/use-password-reset.ts` — ba bước đặt lại, thông báo OTP trung tính, thời gian chờ gửi lại 60 giây và xóa phiên cục bộ khi thành công (FR-011, AC-011).
- `src/hooks/auth/index.ts` — công khai các hook auth mới.
- `src/hooks/auth/use-home-data.ts` — giờ nội dung demo Home chỉ được trả về khi có phiên thực thay vì phiên demo (FR-016).
- `src/stores/auth-session.tsx` — trạng thái phiên thực `loading`/`signedOut`/`signedIn` (FR-012).
- `src/components/auth/sign-in-view.tsx` — thay hook demo, thêm trạng thái đang chờ/lỗi, nối Quên mật khẩu và bật nút SSO Microsoft có trạng thái đang chờ/lỗi riêng (FR-002, FR-003, FR-013, FR-014, FR-016).
- `src/components/auth/password-reset-view.tsx`, `src/app/forgot-password.tsx` — ba bước email, OTP và mật khẩu mới với tiến độ, thời gian chờ gửi lại và trạng thái thành công (FR-011, AC-011).
- `src/components/profile/profile-view.tsx` — hiển thị tên hiển thị, avatar, bio và mã sinh viên thật, mở chỉnh sửa hồ sơ và nối đăng xuất (FR-008, AC-007, AC-008).
- `src/components/profile/profile-edit-view.tsx`, `src/app/profile-edit.tsx` — luồng lưu tên hiển thị, bio, tải/xóa avatar (FR-009, FR-010, AC-009, AC-010).
- `src/components/ui/feedback-banner.tsx`, `src/components/ui/index.ts` — banner lỗi/thông báo/thành công dùng chung.
- `src/components/navigation/root-navigation.tsx` — khôi phục phiên, chắn được bảo vệ với lớp chặn và hai route mới (FR-013, AC-004, AC-007).
- `src/components/onboarding/splash-view.tsx` — chuyển phiên đã khôi phục về Home và người chưa đăng nhập về onboard.
- `src/components/auth/index.ts`, `src/components/profile/index.ts` — công khai các view mới.
- `app.json` — thêm config plugin `expo-secure-store` và `expo-image-picker`.
- `.env.example` — ghi lại base URL công khai và deep link auth mobile.
- Thiết hợp đồng backend (BKPractice-backend, ID-001 1.3): thêm hỗ trợ truy vấn `client_type=mobile` và `code_challenge` cho `GET /api/auth/microsoft`, cho phép deep link mobile đã cấu hình qua kiểm tra chuyển hướng của gateway, và cho phép scheme ứng dụng cho `AUTH_MOBILE_LOGIN_REDIRECT_URL` trong sản xuất.
- `src/app/auth/callback.tsx` — màn hình dự phòng khi deep link đến trong khi ứng dụng chưa đăng nhập hoặc đã bị kill; verifier đã mất nên chỉ hiển thị nút "Quay lại đăng nhập" (biểu tượng cold-start của spec).
- `src/components/navigation/root-navigation.tsx` — thêm `auth/callback` là route công khai trên Stack để deep link cold-start không hiện màn hình không khớp (biểu tượng cold-start FR-003).

- Đã cài đặt `expo-secure-store`, `expo-image-picker` và `expo-crypto` bằng `npx expo install`.

## Các hàm

### `restoreSession` — `src/domain/auth/use-cases.ts`

- Làm gì: đọc token đã lưu, gọi `/api/auth/me`, thử lại một lần qua `refreshSession` khi `401`, và xóa bộ nhớ bảo mật khi làm mới thất bại.
- Đầu vào: `{ auth, store }`.
- Đầu ra: `AuthSession | null`.
- Lý do viết như vậy: nó giữ quyết định khởi động trong tầng domain và thực hiện FR-012/AC-004/AC-006 không ràng buộc React hay HTTP.

### `refreshSession` — `src/domain/auth/use-cases.ts`

- Làm gì: xoay cặp token, ghi vào bộ nhớ bảo mật, giữ người dùng hiện tại khi được cung cấp, và quay lại `/auth/me` khi khởi động.
- Đầu vào: `{ auth, store }`, `refreshToken`, tùy chọn `currentUser`.
- Đầu ra: `AuthSession`.
- Lý do viết như vậy: đường làm mới không cần gọi `/auth/me` thêm giữa phiên, tránh đệ quy làm mới trong khi vẫn xác thực `userId` trả về.

### `signIn`, `signOut` — `src/domain/auth/use-cases.ts`

- Làm gì: đăng nhập ghi cặp chỉ khi "Nhớ tôi" được bật; đăng xuất xóa bộ nhớ ngay cả khi mạng thất bại.
- Đầu vào: phụ thuộc auth, thông tin đăng nhập/phiên và cờ lưu lại.
- Đầu ra: `AuthSession` hoặc `void`.
- Lý do viết như vậy: FR-006 yêu cầu xóa cục bộ khi thất bại, và lựa chọn nhớ phiên vẫn được giữ rõ ràng.

### `signInWithMicrosoft` — `src/domain/auth/use-cases.ts`

- Làm gì: trao đổi `loginCode` dùng một lần của Microsoft với verifier trong bộ nhớ, lưu cặp token và tải `/auth/me`.
- Đầu vào: phụ thuộc auth, `loginCode`, `codeVerifier`.
- Đầu ra: `AuthSession`.
- Lý do viết như vậy: bước trao đổi là bước duy nhất gắn verifier PKCE, và phiên SSO luôn được lưu.

### `createMicrosoftPkce` — `src/lib/auth/microsoft-pkce.ts`

- Làm gì: tạo 32 byte ngẫu nhiên, mã hóa verifier 43 ký tự base64url và băm thành thách thức S256.
- Đầu vào: không có.
- Đầu ra: `{ verifier, challenge }`.
- Lý do viết như vậy: backend yêu cầu thách thức 43 ký tự và verifier không được rời khỏi bộ nhớ.

### `loadMyProfile`, `saveMyProfile`, `requestAvatarUpload`, `uploadAvatar` — `src/domain/auth/use-cases.ts`

- Làm gì: đóng gói cổng hồ sơ với token truy cập và giữ trình tự ý định/tải avatar ở một nơi.
- Đầu vào: kho lưu trữ hồ sơ, session, dữ liệu cập nhật/tệp tùy chọn.
- Đầu ra: `Profile`, `AvatarUploadIntent` hoặc `void`.
- Lý do viết như vậy: hook không bị bó buộc chi tiết endpoint và luồng avatar tuân theo FR-010 chính xác.

### `sendPasswordResetOtp`, `verifyPasswordResetOtp`, `resetPassword` — `src/domain/auth/use-cases.ts`

- Làm gì: chuẩn hóa email và chuyển tiếp ba bước đặt lại.
- Đầu vào: kho lưu trữ đặt lại, email/OTP/token/mật khẩu.
- Đầu ra: `void` hoặc `PasswordResetTicket`.
- Lý do viết như vậy: domain sở hữu chuẩn hóa và hook sở hữu trạng thái bước.

### `requestJson` — `src/lib/auth/api-client.ts`

- Làm gì: gửi JSON với `X-Client-Type: mobile` và/hoặc Bearer, ánh xạ `400/401/403/404/409/429/5xx`, và thử lại một yêu cầu được bảo vệ sau khi làm mới token thành công.
- Đầu vào: `ApiRequest`.
- Đầu ra: JSON đã phân tích hoặc `undefined` cho phản hồi trống.
- Lý do viết như vậy: nó tập trung FR-004/FR-014/FR-015 và AC-005 trong khi giữ token ra khỏi log.

### `setTokenRefresher`, `refreshAccessToken` — `src/lib/auth/api-client.ts`

- Làm gì: đăng ký callback làm mới của ứng dụng và chia sẻ một lần làm mới đang chạy giữa các thử lại `401` cùng lúc.
- Đầu vào: hàm callback làm mới.
- Đầu ra: token đã xoay hoặc `null`.
- Lý do viết như vậy: xoay token refresh làm các lần làm mới song song không an toàn, nên chỉ một lần chạy tại một thời điểm.

### `httpAuthRepository` — `src/lib/auth/auth-repository.ts`

- Làm gì: triển khai đăng nhập, làm mới, người dùng hiện tại và đăng xuất với tiêu đề và thân cước mobile chính xác.
- Đầu vào: thông tin đăng nhập, refresh token hoặc access token.
- Đầu ra: token đã định dạng, `AuthRefresh`, `AuthUser` hoặc `void`.
- Lý do viết như vậy: giữ hợp đồng backend trong một bộ chuyển đổi và vô hiệu hóa thử lại tự động trên đăng nhập/làm mới/đăng xuất.

### `httpProfileRepository` — `src/lib/auth/profile-repository.ts`

- Làm gì: đọc/cập nhật hồ sơ, tạo ý định avatar, và tải ảnh trực tiếp lên URL đã ký bằng các tiêu đề đã trả về.
- Đầu vào: token truy cập, cập nhật một phần, loại/kích thước, hoặc ý định/tệp avatar.
- Đầu ra: `Profile`, `AvatarUploadIntent` hoặc `void`.
- Lý do viết như vậy: nó triển khai FR-008–FR-010 và dịch loại hình ảnh không được hỗ trợ thành thông báo dùng mặt.

### `httpPasswordResetRepository` — `src/lib/auth/password-reset-repository.ts`

- Làm gì: gọi gửi OTP, xác minh OTP và đặt lại với tiêu đề mobile.
- Đầu vào: email, OTP, token đặt lại và mật khẩu mới.
- Đầu ra: `void` hoặc `PasswordResetTicket`.
- Lý do viết như vậy: giữ ba bước hợp đồng tách biệt khỏi UI.

### `secureSessionStore` — `src/lib/auth/secure-session-store.ts`

- Làm gì: đọc, ghi và xóa cặp token trong `expo-secure-store`; giá trị sai định dạng bị xóa.
- Đầu vào: cặp token hoặc không có gì.
- Đầu ra: `AuthTokens | null` hoặc `void`.
- Lý do viết như vậy: FR-015 cấm `AsyncStorage` và ghi log token.

### `createDemoHomeData` — `src/lib/home/demo-home.ts`

- Làm gì: trả về cùng mô phỏng Home trước đây nằm trong phiên demo.
- Đầu vào: không có.
- Đầu ra: `HomeData`.
- Lý do viết như vậy: nội dung Home nằm ngoài spec này, nhưng không được giữ đường đăng nhập demo đang hoạt động.

### `initialsOf` — `src/lib/profile/initials.ts`

- Làm gì: rút gọn hai chữ in hoa từ tên hiển thị.
- Đầu vào: tên hiển thị.
- Đầu ra: chuỗi rút gọn, hoặc `?`.
- Lý do viết như vậy: cả hai màn hình hồ sơ cần phần rút gọn avatar giống nhau.

### `AuthSessionProvider`, `useAuthSession` — `src/stores/auth-session.tsx`

- Làm gì: giữ phiên thực và trạng thái, và mở thiết lập/restore ổn định.
- Đầu vào: children; không props cho hook.
- Đầu ra: ngữ cảnh React.
- Lý do viết như vậy: thành phần và hook chia sẻ một nguồn phiên trong khi store vẫn độc lập với HTTP.

### `useSessionRestore` — `src/hooks/auth/use-session-restore.ts`

- Làm gì: khôi phục phiên khi gắn và đăng ký callback làm mới cập nhật store sau `401`.
- Đầu vào: không có.
- Đầu ra: `void`.
- Lý do viết như vậy: đây là nơi duy nhất nối store với HTTP client tại thời điểm chạy.

### `useSignIn` — `src/hooks/auth/use-sign-in.ts`

- Làm gì: xác thực biểu mẫu, giữ lỗi thông tin đăng nhập chung, lưu cờ nhớ và điều hướng về Home.
- Đầu vào: mã sinh viên/email, mật khẩu và cờ nhớ.
- Đầu ra: trạng thái lỗi/đang chờ và hàm gửi.
- Lý do viết như vậy: FR-014 yêu cầu một thông báo thất bại chung và không rò rỉ sự tồn tại của tài khoản.

### `useMicrosoftSignIn` — `src/hooks/auth/use-microsoft-sign-in.ts`

- Làm gì: xây dựng URL khởi động có tham số truy vấn, mở phiên trình duyệt hệ thống, phân tích `loginCode`, trao đổi một lần và điều hướng về Home.
- Đầu vào: không có.
- Đầu ra: trạng thái lỗi/đang chờ và hàm gửi.
- Lý do viết như vậy: đây là lớp duy nhất biết chi tiết trình duyệt/deep-link trong khi verifier ở cục bộ.

### `useSignOut` — `src/hooks/auth/use-sign-out.ts`

- Làm gì: gọi use case đăng xuất, luôn xóa trạng thái cục bộ và điều hướng về đăng nhập.
- Đầu vào: không có.
- Đầu ra: trạng thái đang chờ và hàm gửi.
- Lý do viết như vậy: AC-007 yêu cầu xóa cục bộ ngay cả khi mạng thất bại.

### `useProfile` — `src/hooks/auth/use-profile.ts`

- Làm gì: tải hồ sơ với trạng thái lỗi/đang chờ dẫn xuất, tải lại theo yêu cầu và xóa phiên khi `401`.
- Đầu vào: không có.
- Đầu ra: hồ sơ, đang chờ, lỗi và `reload`.
- Lý do viết như vậy: trạng thái dẫn xuất tránh setState đồng bộ trong hiệu ứng và giữ hồ sơ trước trong khi làm mới.

### `useProfileEditor` — `src/hooks/auth/use-profile-editor.ts`

- Làm gì: sửa tên/bio, chọn hình, tải ảnh, theo dõi tham chiếu avatar đang chờ và lưu cập nhật một phần.
- Đầu vào: `Profile` ban đầu.
- Đầu ra: trạng thái biểu mẫu và hành động.
- Lý do viết như vậy: nó giữ trình tự ý định tải/tải trực tiếp/PATCH yêu cầu bởi AC-010 và chỉ gửi các trường tùy chọn đã đổi.

### `usePasswordReset` — `src/hooks/auth/use-password-reset.ts`

- Làm gì: chạy email → OTP → mật khẩu, áp dụng thời gian chờ gửi lại 60 giây, hiển thị thông báo trung tính và xóa phiên cục bộ khi thành công.
- Đầu vào: không có.
- Đầu ra: trạng thái bước và hành động.
- Lý do viết như vậy: FR-011/AC-011 yêu cầu các bước theo thứ tự và phản hồi trung tính về sự tồn tại của tài khoản.

### `useHomeData` — `src/hooks/auth/use-home-data.ts`

- Làm gì: trả về mô phỏng Home hiện tại chỉ khi có phiên thực.
- Đầu vào: không có.
- Đầu ra: `HomeData | null`.
- Lý do viết như vậy: các màn hình demo khác giữ bộ kiểm chứng auth hiện có mà không giữ đường đăng nhập demo.

### `SignInView` — `src/components/auth/sign-in-view.tsx`

- Làm gì: hiển thị biểu mẫu mã sinh viên/email và mật khẩu, banner lỗi chung, trạng thái đang chờ, Nhớ tôi, Quên mật khẩu và mục SSO Microsoft.
- Đầu vào: không props.
- Đầu ra: màn hình đăng nhập.
- Lý do viết như vậy: nó giữ ngôn ngữ hình thức đã phê duyệt trong khi thay thế hành vi demo; cả hai đường gửi chia sẻ trạng thái bận/phản hồi duy nhất.

### `PasswordResetView` — `src/components/auth/password-reset-view.tsx`

- Làm gì: hiển thị ba bước đặt lại, nhãn tiến độ, bộ đếm ngược gửi lại, banner lỗi/thông báo và trạng thái thành công.
- Đầu vào: không props.
- Đầu ra: màn hình đặt lại mật khẩu.
- Lý do viết như vậy: nó giữ luồng dễ đọc trên một màn hình và dùng lại banner dùng chung.

### `ProfileView` — `src/components/profile/profile-view.tsx`

- Làm gì: hiển thị avatar/tên/bio/mã sinh viên thật, giữ thẻ và huy hiệu tĩnh hiện có, mở chỉnh sửa hồ sơ, tải lại khi focus và đăng xuất.
- Đầu vào: không props.
- Đầu ra: tab hồ sơ.
- Lý do viết như vậy: chỉ các trường sở hữu auth trở thành thật; nội dung demo Home/khóa học không liên quan giữ nguyên.

### `ProfileEditView`, `ProfileEditForm` — `src/components/profile/profile-edit-view.tsx`

- Làm gì: tải hồ sơ, hiển thị trạng thái đang chờ/lỗi, và sửa/xóa avatar, tên hiển thị và bio.
- Đầu vào: không props; biểu mẫu nhận một `Profile`.
- Đầu ra: màn hình chỉnh sửa hồ sơ.
- Lý do viết như vậy: biểu mẫu bị tách khỏi trình tải và hành động lưu quay lại tab hồ sơ sau PATCH thành công.

### `FeedbackBanner` — `src/components/ui/feedback-banner.tsx`

- Làm gì: hiển thị phản hồi lỗi/thông báo/thành công với biểu tượng và bảng màu phù hợp.
- Đầu vào: thông điệp và sắc thái.
- Đầu ra: banner có tính tiếp cận.
- Lý do viết như vậy: đăng nhập, đặt lại và chỉnh sửa hồ sơ cần một cách xử lý phản hồi nhất quán.

### `AppNavigator`, `RootNavigation` — `src/components/navigation/root-navigation.tsx`

- Làm gì: tải phông chữ, cung cấp lưu trữ phiên, khôi phục phiên, chặn được bảo vệ khi đang tải/chưa đăng nhập, và đăng ký các route mới.
- Đầu vào: không props.
- Đầu ra: Stack của ứng dụng.
- Lý do viết như vậy: FR-013 yêu cầu người chưa đăng nhập không thấy được bảo vệ, và lớp chặn ngăn nhấp nháy nội dung khi khôi phục.

### `SplashView` — `src/components/onboarding/splash-view.tsx`

- Làm gì: chờ quyết định khôi phục, sau đó điều hướng về Home hoặc onboard.
- Đầu vào: không props.
- Đầu ra: màn hình chào.
- Lý do viết như vậy: phiên đã lưu nên bỏ qua onboard/đăng nhập.

## Công nghệ sử dụng

| Công nghệ | Ở đâu | Tại sao |
| --- | --- | --- |
| `expo-secure-store` | `src/lib/auth/secure-session-store.ts` | FR-015 yêu cầu lưu trữ bảo mật thiết bị và cấm `AsyncStorage`. |
| `expo-image-picker` | `src/hooks/auth/use-profile-editor.ts` | AC-010 cần bộ chọn hình thiết bị trước ý định tải R2. |
| `expo-crypto` | `src/lib/auth/microsoft-pkce.ts` | FR-003 cần verifier 43 ký tự ngẫu nhiên và băm SHA-256 mà không cần polyfill crypto của Node. |
| `expo-web-browser` | `src/hooks/auth/use-microsoft-sign-in.ts` | Mở URL khởi động Microsoft trong trình duyệt hệ thống và bắt deep-link gọi lại. |
| `expo-linking` | `src/hooks/auth/use-microsoft-sign-in.ts` | Đọc `loginCode` từ URL gọi lại. |
| Expo Router typed routes | `src/components/navigation/root-navigation.tsx`, route `src/app` mới | Giữ kiến trúc route mỏng và điều hướng có kiểu. |
| React Native `View`, `Text`, `Pressable`, `TextInput`, `Image`, `ActivityIndicator` | Màn hình auth, đặt lại và hồ sơ | Điều khiển gốc, vai trò tiếp cận và hành vi nền tảng. |
| NativeWind + `Brands` tokens | Tất cả UI mới | Dùng lại bảng màu mint, thang chữ, hình viên và màu phản hồi đã phê duyệt từ `.docs/UI/theme-color.md`. |
| Fetch API | `src/lib/auth/*` | Triển khai các endpoint JSON và tải trực tiếp PUT lên URL đã ký mà không cần thư viện HTTP khác. |
| Biến môi trường công khai Expo | `src/lib/auth/config.ts`, `.env.example` | FR-001/FR-003 yêu cầu base URL và chuyển hướng mobile có thể cấu hình; không bí mật công khai. |
| `expo export` | Kiểm tra | Sinh gói iOS với các module gốc và route mới. |

## Kiểm tra

- `npx tsc --noEmit`: pass.
- `npm run lint`: pass.
- `npx expo export --platform ios --output-dir /tmp/bkpractice-export-ios-final`: pass; gói bao gồm các route auth, đặt lại và hồ sơ mới.
- Backend `pnpm jest apps/identity-service/src/modules/auth/presentation/auth.controller.spec.ts --runInBand`: pass.
- Backend `pnpm jest apps/api-gateway/src/application/proxy/gateway-proxy.service.spec.ts libs/config/src/environment.spec.ts --runInBand`: pass.
- `npx expo start --offline --port 8090` sinh lại `.expo/types/router.d.ts` để `forgot-password` và `profile-edit` là route có kiểu; phiên đã dừng sau khi sinh.
- Luồng thực trên thiết bị/backend (T028) chưa chạy trong môi trường này.

## Chưa làm

- Luồng đăng nhập, làm mới, đăng xuất, hồ sơ, avatar, đặt lại mật khẩu và Microsoft thực tế vẫn cần thiết bị và backend đang chạy.
- `.env` của backend phải đặt `AUTH_MOBILE_LOGIN_REDIRECT_URL=bkpracticemobile:///auth/callback` (và gateway phải nhận cùng giá trị) để deep link SSO vượt qua kiểm tra chuyển hướng của gateway.
- Thiết bị thực cần `EXPO_PUBLIC_API_BASE_URL` trỏ đến backend có thể đến; giá trị mặc định hiện tại là `http://localhost:3000`.
- Không có test runner trong repo mobile, nên T006/T013 chưa viết.
- Chấp nhận avatar phụ thuộc vào `R2_ALLOWED_CONTENT_TYPES` của backend; ứng dụng hiển thị thông báo thân thiện nếu ý định bị từ chối.
- Một sự tình từ chối Microsoft có thể kết thúc trên trang lỗi của backend; ứng dụng chỉ hiển thị thông báo chung khi phiên auth quay lại với nó.
