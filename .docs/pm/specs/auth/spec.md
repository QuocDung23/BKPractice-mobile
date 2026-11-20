# MOB-AUTH-001 Xác thực và hồ sơ cá nhân trên ứng dụng mobile

Trạng thái: Approved
Ngày: 2026-11-03

## Mục tiêu

Cho phép một sinh viên đã được cấp tài khoản dùng ứng dụng di động BKPractice để đăng nhập bằng
mã số sinh viên kèm mật khẩu hoặc bằng tài khoản Microsoft của trường, duy trì phiên bằng Bearer
token, làm mới và đăng xuất, xem và sửa hồ sơ của chính mình, và đặt lại mật khẩu BKPractice cục bộ
bằng OTP email. Tính năng này thay thế luồng đăng nhập demo hiện tại bằng Identity Service thật, gọi
qua API Gateway.

## Tác nhân

- **Sinh viên đã được cấp tài khoản:** người dùng ứng dụng mobile có tài khoản BKPractice do quản
  trị viên import. Đợt đầu của tính năng này chỉ phục vụ sinh viên.
- **API Gateway:** cổng vào công khai, xác minh access token BKPractice, loại bỏ header định danh giả
  mạo và chuyển tiếp request tới Identity.
- **Identity Service:** sở hữu thông tin đăng nhập, định danh nhà cung cấp đã liên kết, trạng thái
  tài khoản, việc phát hành token, state của phiên làm mới, Profile và trạng thái đặt lại mật khẩu.
- **Microsoft Entra ID của trường:** nhà cung cấp định danh tin cậy cho tài khoản Microsoft do
  trường cấp.
- **Brevo:** kênh Identity dùng để gửi OTP đặt lại mật khẩu tới email trường đã lưu. Ứng dụng không
  bao giờ gọi trực tiếp Brevo.
- **Bộ nhớ bảo mật thiết bị:** Keychain (iOS) và Keystore (Android) dùng để giữ token.

## Bối cảnh

Ứng dụng mobile hiện xác thực bằng mô hình demo cục bộ (`authenticateDemoStudent`, `DemoSession`) và
chưa gọi backend. Đặc tả backend đã Approved
[ID-001 Authentication](../../../../../BKPractice-backend/.docs/specs/01-identity/authentication/spec.md)
đã hỗ trợ client app: với header request `X-Client-Type: mobile`, login, Microsoft exchange và
refresh trả `userId`, `accessToken` và `refreshToken` trong JSON thay vì cookie HttpOnly, và Gateway
chấp nhận Bearer access token. ID-002 Profile định nghĩa `GET/PATCH /api/profile/me` và avatar upload
intent; ID-007 định nghĩa luồng đặt lại mật khẩu bằng OTP. Đặc tả này chỉ định nghĩa hợp đồng phía
client mobile tiêu thụ các hành vi backend đã Approved đó.

Ngoài phạm vi của tính năng này: nhánh đăng nhập cục bộ của giảng viên, admin đọc/xoá mềm User
(ID-006), quản trị RBAC (ID-003), tìm kiếm hồ sơ công khai (ID-005), đăng ký công khai, MFA, và mọi
thay đổi hợp đồng backend khác ngoài query parameter khởi tạo Microsoft cho mobile đã được chốt.

## Yêu cầu chức năng

- **MOB-AUTH-FR-001 — Base URL cấu hình:** Ứng dụng MUST đọc API base URL từ biến môi trường Expo
  công khai (ví dụ `EXPO_PUBLIC_API_BASE_URL`). Ứng dụng MUST NOT hardcode host trong bất kỳ màn
  hình, hook hay component nào.
- **MOB-AUTH-FR-002 — Đăng nhập sinh viên:** Ứng dụng MUST gọi `POST /api/auth/login` với body
  `{ identifier, password }` và header `X-Client-Type: mobile`. Khi `200`, ứng dụng MUST đọc
  `userId`, `accessToken` và `refreshToken` từ JSON body. `identifier` chứa mã số sinh viên (MSSV)
  với sinh viên; ứng dụng MUST NOT gửi role, permission, status hay trường định danh tin cậy nào.
- **MOB-AUTH-FR-003 — Đăng nhập Microsoft:** Ứng dụng MUST bắt đầu
  `GET /api/auth/microsoft?client_type=mobile&code_challenge=<S256>` trong browser hệ thống, nhận
  `loginCode` dùng một lần qua deep link chuyển hướng mobile đã cấu hình, và đổi mã bằng
  `POST /api/auth/microsoft/exchange` với `{ loginCode, codeVerifier }` và `X-Client-Type: mobile`.
  Verifier MUST chỉ được giữ trong bộ nhớ trong thời gian của luồng và MUST NOT xuất hiện trong URL,
  log hay store lưu trữ.
- **MOB-AUTH-FR-004 — Bearer access:** Mọi request được bảo vệ MUST gửi
  `Authorization: Bearer <accessToken>`. Ứng dụng MUST NOT dùng cookie hay CSRF cho hợp đồng mobile.
- **MOB-AUTH-FR-005 — Làm mới phiên:** Ứng dụng MUST gọi `POST /api/auth/refresh` với
  `{ refreshToken }` và `X-Client-Type: mobile` để nhận cặp token thay thế. Việc làm mới thất bại
  MUST xoá phiên cục bộ và đưa người dùng về màn hình đăng nhập.
- **MOB-AUTH-FR-006 — Đăng xuất:** Ứng dụng MUST gọi `POST /api/auth/logout` với Bearer access token
  và `{ refreshToken }`, sau đó xoá token cục bộ. Việc xoá cục bộ MUST xảy ra kể cả khi gọi mạng thất
  bại, để người dùng không bị kẹt trong trạng thái đã đăng nhập.
- **MOB-AUTH-FR-007 — Người dùng hiện tại:** Ứng dụng MUST gọi `GET /api/auth/me` với Bearer access
  token để đọc `{ userId, studentId, roles, status }` và dùng kết quả để xác nhận phiên khi mở ứng
  dụng.
- **MOB-AUTH-FR-008 — Đọc hồ sơ của tôi:** Ứng dụng MUST gọi `GET /api/profile/me` với Bearer access
  token và đọc `{ userId, displayName, avatar, bio }`.
- **MOB-AUTH-FR-009 — Cập nhật hồ sơ của tôi:** Ứng dụng MUST gọi `PATCH /api/profile/me` với Bearer
  access token và body từng phần gồm `displayName`, `avatar` và `bio`. `null` xoá `bio` hoặc
  `avatar`; trường bị bỏ qua giữ nguyên giá trị hiện tại.
- **MOB-AUTH-FR-010 — Tải avatar:** Ứng dụng MUST gọi `POST /api/profile/me/avatar/upload-url` với
  `{ contentType, size }`, tải ảnh đã chọn trực tiếp lên `uploadUrl` trả về kèm `headers` trả về,
  sau đó gửi tham chiếu `avatar` trả về trong `PATCH` hồ sơ.
- **MOB-AUTH-FR-011 — Đặt lại mật khẩu:** Ứng dụng MUST hỗ trợ ba bước OTP:
  `POST /api/auth/password/send-otp` với `{ email }` (mong đợi `202` và thông báo trung tính về tài
  khoản), `POST /api/auth/password/verify-otp` với `{ email, otp }` (đọc `resetToken`), và
  `POST /api/auth/password/reset` với `{ resetToken, newPassword }` (mong đợi `204`). Mỗi bước MUST
  gửi `X-Client-Type: mobile`.
- **MOB-AUTH-FR-012 — Phục hồi phiên:** Khi khởi động, ứng dụng MUST đọc token đã lưu, gọi
  `GET /api/auth/me`, và khi gặp `401` thì thử làm mới đúng một lần trước khi quyết định. Nếu làm mới
  thất bại, ứng dụng MUST xoá token và hiển thị màn hình đăng nhập.
- **MOB-AUTH-FR-013 — Chặn route:** Người dùng đã đăng nhập MUST được đưa về route home sau khi đăng
  nhập thành công, và người dùng không có phiên hợp lệ MUST bị chuyển về đăng nhập trước khi một
  route được bảo vệ render.
- **MOB-AUTH-FR-014 — Lỗi an toàn:** Ứng dụng MUST ánh xạ `400`, `401`, `403`, `409` và `503` thành
  thông báo cho người dùng. Đăng nhập thất bại MUST hiển thị một thông báo chung và MUST NOT tiết lộ
  mã số sinh viên có tồn tại hay không.
- **MOB-AUTH-FR-015 — Không rò rỉ:** Ứng dụng MUST NOT log mật khẩu hay bất kỳ token nào, MUST NOT
  đặt token vào deep link hay URL, và MUST NOT lưu token trong `AsyncStorage`.
- **MOB-AUTH-FR-016 — Gỡ demo auth:** Phiên thật MUST thay thế hook đăng nhập demo, domain model và
  store demo. Ứng dụng MUST NOT giữ đường đăng nhập demo hoạt động song song với đường thật.

## Quy tắc nghiệp vụ

- Chỉ tài khoản `ACTIVE` nhận token. Tài khoản `LOCKED`, `PENDING` hoặc đã xoá mềm bị từ chối với
  cùng lỗi chung như sai mật khẩu.
- Token chỉ được lưu trong bộ nhớ bảo mật thiết bị. Access token có thời hạn ngắn; refresh token có
  thời hạn dài hơn và xoay vòng sau mỗi lần làm mới, nên refresh token mới nhất phải ghi đè bản đã
  lưu.
- Đặt lại mật khẩu thành công sẽ thu hồi mọi phiên BKPractice trên backend, nên ứng dụng MUST xoá
  phiên cục bộ sau khi reset thành công và hiển thị màn hình đăng nhập.
- Hợp đồng mobile luôn dùng `X-Client-Type: mobile` cho các lời gọi API; riêng bước mở Microsoft
  trong browser dùng query `client_type=mobile` và `code_challenge`. Ứng dụng không bao giờ dựa vào
  cookie, Origin hay kiểm tra CSRF.
- Client không thể tự cung cấp role, permission, trạng thái tài khoản, tenant/object ID Microsoft,
  hay header định danh tin cậy.

## Quy tắc phân quyền

- Các bước mobile công khai (login, Microsoft start/callback/exchange, refresh, logout, ba bước đặt
  lại mật khẩu) không cần access token sẵn có.
- Các bước mobile được bảo vệ (`GET /api/auth/me`, đọc/cập nhật hồ sơ, avatar upload intent) cần
  Bearer access token hợp lệ. Gateway xác minh token và chỉ chuyển tiếp định danh đã xác minh.
- Tính năng này không cấp quyền quản trị nào. Ứng dụng không bao giờ gọi `/api/admin/*`, RBAC hay
  route quản lý người dùng.

## Đầu vào

| Bước | Phương thức và đường dẫn | Body | Header bắt buộc |
| --- | --- | --- | --- |
| Đăng nhập | `POST /api/auth/login` | `{ identifier, password }` | `X-Client-Type: mobile` |
| Bắt đầu Microsoft | `GET /api/auth/microsoft?client_type=mobile&code_challenge=<S256>` | không có | không có |
| Đổi mã Microsoft | `POST /api/auth/microsoft/exchange` | `{ loginCode, codeVerifier }` | `X-Client-Type: mobile` |
| Làm mới | `POST /api/auth/refresh` | `{ refreshToken }` | `X-Client-Type: mobile` |
| Đăng xuất | `POST /api/auth/logout` | `{ refreshToken }` | `Authorization: Bearer` |
| Người dùng hiện tại | `GET /api/auth/me` | không có | `Authorization: Bearer` |
| Đọc hồ sơ của tôi | `GET /api/profile/me` | không có | `Authorization: Bearer` |
| Cập nhật hồ sơ của tôi | `PATCH /api/profile/me` | `{ displayName?, avatar?, bio? }` | `Authorization: Bearer` |
| Avatar intent | `POST /api/profile/me/avatar/upload-url` | `{ contentType, size }` | `Authorization: Bearer` |
| Gửi OTP | `POST /api/auth/password/send-otp` | `{ email }` | `X-Client-Type: mobile` |
| Xác minh OTP | `POST /api/auth/password/verify-otp` | `{ email, otp }` | `X-Client-Type: mobile` |
| Đặt lại mật khẩu | `POST /api/auth/password/reset` | `{ resetToken, newPassword }` | `X-Client-Type: mobile` |

## Đầu ra

- Đăng nhập, đổi mã Microsoft và làm mới trả `200` với `userId`, `accessToken` và `refreshToken`
  trong JSON body.
- Đăng xuất trả `204` không có body.
- `GET /api/auth/me` trả `userId`, `studentId`, `roles` và `status`.
- Đọc và cập nhật hồ sơ trả `userId`, `displayName`, `avatar` và `bio`.
- Avatar intent trả `avatar`, `uploadUrl` có thời hạn ngắn, `expiresInSeconds` và `headers`.
- Gửi OTP trả `202`; xác minh OTP trả `resetToken`; đặt lại mật khẩu trả `204`.
- Trạng thái quan sát được: home khi đã đăng nhập, màn hình đăng nhập với thông báo lỗi chung, màn
  hình hồ sơ gắn dữ liệu thật, và luồng đặt lại mật khẩu ba bước.

## Tình huống lỗi

| Trường hợp | Hành vi quan sát được |
| --- | --- |
| Thiếu hoặc sai định dạng trường đăng nhập | Request bị từ chối trước khi state xác thực thay đổi; ứng dụng hiển thị thông báo trường hoặc thông báo chung. |
| MSSV không tồn tại hoặc sai mật khẩu | Một lỗi chung; không token nào được phát hành. |
| Tài khoản `LOCKED`, `PENDING` hoặc đã xoá mềm | Đăng nhập hoặc làm mới bị từ chối; không token nào được phát hành. |
| Refresh token sai, hết hạn, bị thu hồi hoặc bị dùng lại | Làm mới bị từ chối; ứng dụng xoá phiên và hiển thị đăng nhập. |
| Access token thiếu, hết hạn hoặc không hợp lệ | Lời gọi được bảo vệ thất bại `401`; ứng dụng làm mới một lần rồi đăng xuất. |
| Kết quả deep link Microsoft không tin cậy hoặc thiếu | Việc đổi mã thất bại; không token nào được phát hành; ứng dụng hiển thị thông báo chung. |
| OTP sai, hết hạn, đã dùng hoặc vượt lượt thử | Xác minh bị từ chối; không trả reset token. |
| Cập nhật hồ sơ với trường không hợp lệ | Request bị từ chối `400`; ứng dụng giữ giá trị cũ. |
| Avatar intent với loại không hỗ trợ hoặc kích thước quá 50 MiB | Request bị từ chối `400`. |
| Identity hoặc dependency không khả dụng | Lời gọi thất bại `503`; ứng dụng hiển thị thông báo có thể thử lại và giữ token trừ khi phiên đã không còn hợp lệ. |

## Tình huống biên

- Nhiều lời gọi được bảo vệ đồng thời cùng gặp `401` MUST NOT khởi động hai lần làm mới; ứng dụng
  thực hiện một lần làm mới và thử lại các lời gọi đang chờ, hoặc bỏ chúng.
- Ứng dụng có thể bị đưa ra nền sau khi access token hết hạn; khi quay lại, luồng phục hồi phải làm
  mới trước khi tải dữ liệu được bảo vệ.
- Phiên browser Microsoft có thể trả về khi ứng dụng đã bị kill; ứng dụng phải xử lý cold start của
  URL chuyển hướng và phải đổi mã dùng một lần trong thời hạn 60 giây.
- `loginCode` dùng một lần và hết hạn sau 60 giây; lần đổi thứ hai phải thất bại.
- OTP đặt lại mật khẩu chỉ được gửi lại sau 60 giây; ứng dụng không được cho phép gửi lại trước đó.
- Xoay vòng refresh token nghĩa là một token cũ đang trên đường có thể bị từ chối; ứng dụng chỉ được
  lưu cặp mới nhất.

## Tiêu chí nghiệm thu

- **MOB-AUTH-AC-001:** Cho trước ứng dụng đã cấu hình base URL, khi một sinh viên `ACTIVE` đã được
  cấp tài khoản đăng nhập đúng MSSV và mật khẩu, thì ứng dụng lưu `accessToken`/`refreshToken` an
  toàn và chuyển tới home.
- **MOB-AUTH-AC-002:** Cho trước MSSV không tồn tại hoặc sai mật khẩu, khi thử đăng nhập, thì ứng
  dụng hiển thị cùng một thông báo chung cho cả hai và không lưu token.
- **MOB-AUTH-AC-003:** Cho trước tài khoản Microsoft của trường thuộc một sinh viên đã được cấp tài
  khoản, khi luồng đăng nhập mobile hoàn tất và mã dùng một lần được đổi đúng một lần trong 60 giây,
  thì ứng dụng lưu cặp token và chuyển tới home, và không token nào xuất hiện trong URL.
- **MOB-AUTH-AC-004:** Cho trước một phiên hợp lệ đã lưu, khi ứng dụng mở, thì nó xác nhận phiên bằng
  `/api/auth/me` và hiển thị home mà không yêu cầu đăng nhập lại.
- **MOB-AUTH-AC-005:** Cho trước access token hết hạn và refresh token hợp lệ, khi một lời gọi được
  bảo vệ trả `401`, thì ứng dụng làm mới một lần và hoàn tất lời gọi mà không có lỗi hiển thị.
- **MOB-AUTH-AC-006:** Cho trước refresh token không hợp lệ hoặc đã bị thu hồi, khi ứng dụng phục hồi
  phiên, thì nó xoá bộ nhớ lưu trữ và hiển thị đăng nhập.
- **MOB-AUTH-AC-007:** Cho trước người dùng đã đăng nhập, khi họ đăng xuất, thì ứng dụng xoá token kể
  cả khi gọi mạng thất bại, và route được bảo vệ sau đó chuyển về đăng nhập.
- **MOB-AUTH-AC-008:** Cho trước người dùng đã đăng nhập, khi họ đọc hồ sơ, thì ứng dụng hiển thị
  `displayName`, `avatar` và `bio` từ server qua `/api/profile/me`.
- **MOB-AUTH-AC-009:** Cho trước người dùng đã đăng nhập, khi họ đổi `displayName` và xoá `bio`, thì
  ứng dụng chỉ gửi các trường đó tới `PATCH /api/profile/me` và hiển thị giá trị trả về.
- **MOB-AUTH-AC-010:** Cho trước người dùng đã đăng nhập, khi họ chọn một ảnh được phép, thì ứng dụng
  yêu cầu upload intent, tải trực tiếp lên `uploadUrl` với headers trả về, và hiển thị avatar mới sau
  `PATCH` hồ sơ.
- **MOB-AUTH-AC-011:** Cho trước người dùng quên mật khẩu, khi họ hoàn tất gửi, xác minh và đặt lại
  đúng thứ tự, thì ứng dụng hiển thị thành công, xoá phiên cục bộ và đăng nhập được bằng mật khẩu mới.
- **MOB-AUTH-AC-012:** Cho trước bất kỳ bước login, refresh, logout, hồ sơ hay đặt lại mật khẩu, khi
  request được kiểm tra, thì nó mang `X-Client-Type: mobile` (hoặc header Bearer với route được bảo
  vệ) và không chứa cookie, role, permission hay trường status.
- **MOB-AUTH-AC-013:** Cho trước dữ liệu đã lưu và log sau khi đăng nhập thành công, thì không mật
  khẩu hay token nào xuất hiện trong `AsyncStorage`, URL hay một dòng log.
- **MOB-AUTH-AC-014:** Cho trước mã đăng nhập demo, khi tính năng này được triển khai, thì đường đăng
  nhập demo không còn truy cập được và session provider thật là đường duy nhất được nối.

## Ngoài phạm vi

- Nhánh đăng nhập cục bộ của giảng viên (email kèm mật khẩu).
- Danh sách User admin, chi tiết User admin và xoá mềm (ID-006); quản trị RBAC (ID-003).
- Tìm kiếm hồ sơ công khai (ID-005) và xem hồ sơ công khai của người khác.
- Đăng ký công khai, đăng nhập Google, tài khoản Microsoft cá nhân, MFA và đổi mật khẩu ngoài luồng
  đặt lại.
- Mọi thay đổi hợp đồng Identity backend, định tuyến Gateway hoặc hành vi `X-Client-Type`.
- Xác thực offline hoặc trạng thái đã đăng nhập được cache mà không có token đã xác minh.

## Phụ thuộc

- Backend [ID-001 Authentication](../../../../../BKPractice-backend/.docs/specs/01-identity/authentication/spec.md) — Approved `1.2`.
- Backend [ID-002 Profile](../../../../../BKPractice-backend/.docs/specs/01-identity/profile/spec.md) — Approved.
- Backend [ID-007 đặt lại mật khẩu](../../../../../BKPractice-backend/.docs/specs/01-identity/password-reset/spec.md) — Approved.
- Backend [GW-001 phân tầng API Gateway](../../../../../BKPractice-backend/.docs/specs/gateway/identity/spec.md) — Approved `1.0`.
- [Kiến trúc mobile](../../architecture/README.md) và [quy tắc agent](../../agent/rules.md).
- Tài liệu Expo đúng phiên bản SDK trong `package.json` trước khi chạm vào bất kỳ API Expo hay React
  Native nào.

## Câu hỏi mở

1. **Header bắt đầu Microsoft.** **Đã chốt ngày 2026-11-03:** chọn phương án (b). Backend nhận
   `client_type=mobile` và `code_challenge` qua query parameter; ứng dụng mở URL đó trong browser hệ
   thống. Đặc tả backend ID-001 đã cập nhật phiên bản 1.3.
2. **Giá trị chuyển hướng mobile.** Đã chốt mặc định `bkpracticemobile:///auth/callback` (scheme
   `bkpracticemobile` trong `app.json`); `AUTH_MOBILE_LOGIN_REDIRECT_URL` của backend phải khớp. Đây
   là cấu hình môi trường, không phải thay đổi hành vi.

## Lịch sử sửa đổi

| Ngày | Phiên bản | Tác giả | Tóm tắt |
| --- | --- | --- | --- |
| 2026-11-03 | 0.1 | opencode / người dùng | Bản nháp đầu tiên cho auth mobile, hồ sơ cá nhân và đặt lại mật khẩu. |
| 2026-11-03 | 1.0 | người dùng | Approved để triển khai. Luồng Microsoft vẫn chờ chốt câu hỏi mở 1. |
| 2026-11-03 | 1.1 | người dùng | Chốt câu hỏi mở 1 theo phương án query parameter; cập nhật FR-003, bảng đầu vào và deep link mặc định. |
