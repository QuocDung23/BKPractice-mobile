# MOB-AUTH-002 Đổi mật khẩu BKPractice khi đã đăng nhập

Trạng thái: Approved  
Ngày: 2026-11-04

## Mục tiêu

Cho phép người dùng đã đăng nhập trong ứng dụng BKPractice mobile tự đổi mật khẩu cục bộ của
BKPractice bằng cách nhập mật khẩu hiện tại và mật khẩu mới. Tính năng chỉ tiêu thụ hợp đồng backend
ID-008 đã Approved và đã triển khai; không thay đổi hành vi backend.

## Tác nhân

- **Người dùng BKPractice đã đăng nhập:** sinh viên có phiên hợp lệ trong ứng dụng mobile.
- **API Gateway:** xác minh Bearer access token và chuyển tiếp request đã xác thực tới Identity.
- **Identity Service:** xác minh mật khẩu hiện tại, lưu hash mới, giữ phiên hiện tại và thu hồi các
  phiên khác của cùng người dùng.

## Bối cảnh

Spec [MOB-AUTH-001](../auth/spec.md) đã Approved và đã triển khai đăng nhập, phục hồi phiên và đặt
lại mật khẩu bằng OTP. Spec đó loại trừ rõ "đổi mật khẩu ngoài luồng đặt lại"; tính năng này bổ
sung đúng hành vi còn thiếu đó, không sửa MOB-AUTH-001.

Backend [ID-008](../../../../../BKPractice-backend/.docs/specs/01-identity/change-password/spec.md)
đã Approved `1.0` ngày `2026-11-04` và đã triển khai `POST /api/auth/password/change`. Route nằm
ngoài public allowlist của Gateway nên luôn yêu cầu Bearer access token; Identity lấy user ID và
session ID từ token, không nhận `userId` từ client. Đổi thành công trả `204`, giữ phiên hiện tại và
thu hồi mọi phiên khác của cùng người dùng.

Ngoài phạm vi: đổi mật khẩu Microsoft/Entra, thay email, MFA, quên mật khẩu (đã có trong MOB-AUTH-001),
quản trị credential của người khác, chỉnh sửa hồ sơ, và mọi thay đổi backend.

## Yêu cầu chức năng

- **MOB-AUTH-002-FR-001 — Lối vào:** Người dùng đã đăng nhập MUST mở được màn hình đổi mật khẩu từ
  màn hình Profile. Route `/change-password` MUST là route được bảo vệ, không nằm trong danh sách
  route công khai.
- **MOB-AUTH-002-FR-002 — Request:** Ứng dụng MUST gọi `POST /api/auth/password/change` với
  `Authorization: Bearer <accessToken>`, `X-Client-Type: mobile` và body đúng hai trường
  `{ currentPassword, newPassword }`. Ứng dụng MUST NOT gửi `userId`, role, session ID hay trường
  định danh nào khác.
- **MOB-AUTH-002-FR-003 — Header bắt buộc:** Request MUST mang `X-Client-Type: mobile`; nếu thiếu,
  Identity coi request là web và từ chối vì không có Origin hợp lệ. Header này là điều kiện của hợp
  đồng, không phải tuỳ chọn.
- **MOB-AUTH-002-FR-004 — Xác minh phía client:** Trước khi gọi mạng, ứng dụng MUST yêu cầu mật khẩu
  hiện tại không rỗng, mật khẩu mới dài 8–128 ký tự, mật khẩu mới khác mật khẩu hiện tại, và trường
  xác nhận khớp mật khẩu mới. Ứng dụng MUST NOT trim hoặc chuẩn hoá chuỗi mật khẩu.
- **MOB-AUTH-002-FR-005 — Thành công:** Khi nhận `204`, ứng dụng MUST hiển thị xác nhận đổi mật khẩu
  thành công và thông báo các thiết bị khác đã bị đăng xuất, MUST giữ nguyên phiên và token cục bộ,
  và MUST đưa người dùng về Profile.
- **MOB-AUTH-002-FR-006 — Sai mật khẩu hiện tại:** `401` sau một lần làm mới token MUST được hiển thị
  là "mật khẩu hiện tại không đúng"; ứng dụng MUST NOT xoá phiên cục bộ vì lỗi này và MUST NOT coi
  đây là phiên hết hạn.
- **MOB-AUTH-002-FR-007 — Phiên thật sự hết hạn:** Khi làm mới token thất bại, cơ chế làm mới hiện có
  MUST xoá phiên và route guard MUST đưa người dùng về đăng nhập như MOB-AUTH-001.
- **MOB-AUTH-002-FR-008 — Lỗi an toàn:** Ứng dụng MUST ánh xạ `400`, `403`, `429`, `503` và lỗi mạng
  thành thông báo an toàn, có thể thử lại khi phù hợp, và MUST không tiết lộ hash, token hay chi tiết
  nội bộ.
- **MOB-AUTH-002-FR-009 — Không rò rỉ:** Ứng dụng MUST NOT log, lưu vào `AsyncStorage`, đưa vào URL,
  deep link hay analytics bất kỳ mật khẩu nào, kể cả khi lỗi.
- **MOB-AUTH-002-FR-010 — Tái dùng hạ tầng:** Ứng dụng MUST dùng axios client, secure session store
  và các lớp domain/hook hiện có. Tính năng MUST NOT thêm thư viện, biến môi trường hay cấu hình mới.

## Quy tắc nghiệp vụ

- Thao tác chỉ đổi credential cục bộ BKPractice của chính principal đang đăng nhập; không có thao tác
  quản trị và không đổi mật khẩu Microsoft.
- Mật khẩu mới giữ nguyên chuỗi người dùng nhập: không trim, không đổi Unicode, không đổi khoảng
  trắng đầu/cuối. Chỉ so sánh độ dài và tính khác biệt.
- Backend sở hữu kiểm tra cuối cùng: mật khẩu hiện tại đúng, độ dài 8–128, khác mật khẩu hiện tại,
  và tài khoản còn đủ điều kiện. Client chỉ kiểm tra sớm để tránh request chắc chắn thất bại.
- Phiên hiện tại tiếp tục hoạt động sau khi đổi thành công, nên ứng dụng không được đăng xuất người
  dùng. Việc thu hồi phiên khác do backend thực hiện trong cùng transaction.
- Đổi mật khẩu không thay đổi hồ sơ, email, role, trạng thái tài khoản hay liên kết Microsoft.

## Quy tắc phân quyền

- Chỉ principal đã được xác minh qua Bearer access token BKPractice hợp lệ được gọi endpoint.
- User ID và session ID lấy từ token; client không được và không thể chọn người dùng khác.
- Không có role đặc biệt nào; mọi role, kể cả ADMIN, chỉ đổi được mật khẩu của chính mình.
- Ứng dụng không gọi `/api/admin/*`, RBAC hay route quản lý người dùng.

## Đầu vào

| Bước | Phương thức và đường dẫn | Body | Header bắt buộc |
| --- | --- | --- | --- |
| Đổi mật khẩu | `POST /api/auth/password/change` | `{ currentPassword, newPassword }` | `Authorization: Bearer` và `X-Client-Type: mobile` |

## Đầu ra

- Thành công trả `204` không body.
- Không trả mật khẩu, hash, token mới hay dữ liệu credential.
- Trạng thái quan sát được: màn hình đổi mật khẩu trong theme hiện có, xác nhận thành công và quay
  lại Profile; lỗi hiển thị ngay trên màn hình mà không làm mất phiên khi chỉ sai mật khẩu hiện tại.

## Tình huống lỗi

| Trường hợp | Hành vi quan sát được |
| --- | --- |
| Mật khẩu hiện tại sai | Request `401`; ứng dụng hiển thị "Current password is incorrect.", giữ phiên và token, không đổi mật khẩu. |
| Mật khẩu mới ngắn hơn 8, dài hơn 128, trùng mật khẩu hiện tại hoặc xác nhận không khớp | Ứng dụng chặn trước khi gửi và hiển thị lỗi tại form. Trùng mật khẩu hiện tại cũng được backend từ chối nếu lọt qua client. |
| Mật khẩu hiện tại để trống | Ứng dụng chặn trước khi gửi. |
| Thiếu hoặc sai access token, phiên đã bị thu hồi | Làm mới một lần; nếu thất bại, xoá phiên và đưa về đăng nhập. |
| Refresh token hết hạn hoặc bị thu hồi | Xoá phiên cục bộ và đưa về đăng nhập. |
| Body sai định dạng | `400`; ứng dụng hiển thị thông báo kiểm tra lại thông tin và không đổi mật khẩu. |
| Không có Origin hợp lệ do thiếu `X-Client-Type: mobile` | `403`; đây là lỗi tích hợp, không phải lỗi người dùng. Ứng dụng hiển thị thông báo chung. |
| Quá nhiều lần thử | `429`; ứng dụng hiển thị thông báo chờ rồi thử lại. |
| Identity hoặc dependency không khả dụng | `503`; ứng dụng hiển thị thông báo có thể thử lại và giữ phiên. |
| Mất mạng hoặc timeout | Thông báo kiểm tra kết nối; giữ nguyên dữ liệu đã nhập, trừ mật khẩu không được log hay lưu. |

## Tình huống biên

- Người dùng bấm gửi nhiều lần MUST NOT tạo nhiều request đồng thời; nút bị vô hiệu hoá khi đang gửi.
- Access token hết hạn trong lúc màn hình đang mở: request được làm mới đúng một lần rồi gửi lại;
  mật khẩu hiện tại vẫn đúng thì thành công, sai thì hiển thị lỗi mật khẩu hiện tại.
- Sai mật khẩu hiện tại có thể kích hoạt một lần xoay refresh token qua cơ chế làm mới dùng chung;
  đây là hành vi chấp nhận được và không làm mất phiên.
- Ứng dụng có thể bị đưa ra nền sau khi submit; kết quả trả về muộn không được ghi đè màn hình khác.
  Hook chỉ cập nhật state khi component còn mounted.
- Mật khẩu chứa Unicode, khoảng trắng đầu/cuối hoặc ký tự đặc biệt được gửi nguyên trạng.
- Sau khi đổi thành công, người dùng có thể tiếp tục dùng ứng dụng bằng token hiện tại; lần đăng nhập
  tiếp theo phải dùng mật khẩu mới.

## Tiêu chí nghiệm thu

- **MOB-AUTH-002-AC-001:** Cho trước người dùng đã đăng nhập, khi mở Profile và chọn "Change
  password", thì màn hình đổi mật khẩu hiển thị và route được bảo vệ.
- **MOB-AUTH-002-AC-002:** Cho trước mật khẩu hiện tại đúng và mật khẩu mới hợp lệ, khi gửi, thì
  ứng dụng nhận `204`, hiển thị xác nhận và quay về Profile, và phiên cục bộ vẫn còn.
- **MOB-AUTH-002-AC-003:** Cho trước mật khẩu hiện tại sai, khi gửi, thì ứng dụng hiển thị lỗi mật
  khẩu hiện tại, vẫn đăng nhập và không xoá token.
- **MOB-AUTH-002-AC-004:** Cho trước mật khẩu mới dưới 8, trên 128, trùng mật khẩu hiện tại hoặc xác
  nhận không khớp, khi gửi, thì ứng dụng không gọi endpoint và hiển thị lỗi tương ứng.
- **MOB-AUTH-002-AC-005:** Cho trước request bất kỳ của tính năng, khi kiểm tra, thì request mang
  Bearer token và `X-Client-Type: mobile`, body chỉ có `currentPassword` và `newPassword`, và không
  có mật khẩu hay token trong log.
- **MOB-AUTH-002-AC-006:** Cho trước refresh token không hợp lệ, khi gửi đổi mật khẩu, thì ứng dụng
  xoá phiên và route guard đưa về đăng nhập.
- **MOB-AUTH-002-AC-007:** Cho trước lần đổi thành công, khi đăng nhập trên thiết bị khác bằng mật
  khẩu cũ, thì thất bại; bằng mật khẩu mới, thì thành công.
- **MOB-AUTH-002-AC-008:** Cho trước mã nguồn sau triển khai, khi kiểm tra, thì không có thư viện,
  biến môi trường hay cấu hình mới, và không có thay đổi ngoài phạm vi.

## Ngoài phạm vi

- Đặt lại mật khẩu khi quên hoặc không đăng nhập được (MOB-AUTH-001 và ID-007).
- Đổi mật khẩu Microsoft/Entra hoặc bất kỳ credential bên ngoài BKPractice.
- Thay đổi email, hồ sơ, avatar, role, trạng thái tài khoản.
- MFA, gửi email/OTP, quản trị credential của người dùng khác.
- Màn hình Settings tổng quát; biểu tượng gear trên Profile hiện chưa có hành vi và không thuộc
  tính năng này.
- Thay đổi backend, Gateway, contract, migration hoặc cấu hình runtime.

## Phụ thuộc

- Backend [ID-008 đổi mật khẩu](../../../../../BKPractice-backend/.docs/specs/01-identity/change-password/spec.md)
  — Approved `1.0`, đã triển khai.
- Backend [ID-001 Authentication](../../../../../BKPractice-backend/.docs/specs/01-identity/authentication/spec.md)
  — principal, access token và session.
- [MOB-AUTH-001](../auth/spec.md) — phiên, refresh và route guard hiện có.
- [Kiến trúc mobile](../../architecture/README.md) và [quy tắc agent](../../../agent/rules.md).
- Tài liệu Expo đúng phiên bản SDK trong `package.json` trước khi chạm API Expo/React Native.

## Câu hỏi mở

Ba quyết định giao diện dưới đây đã được chủ sở hữu chốt ngày `2026-11-04`. Chúng không thay đổi
hợp đồng backend.

1. **Lối vào:** đặt một dòng "Change password" trong danh sách menu của Profile, ngay sau "Personal
   information", dùng icon khoá. Không xây màn hình Settings mới và không nối biểu tượng gear.
2. **Trường xác nhận:** thêm ô "Confirm new password" chỉ kiểm tra phía client, không gửi lên backend.
   Lý do: tránh người dùng gõ sai mật khẩu mới rồi bị khoá khỏi tài khoản.
3. **Sau khi thành công:** giữ phiên hiện tại (đúng ID-008), hiển thị thông báo "Other devices have
   been signed out" và quay về Profile; không đăng xuất và không yêu cầu đăng nhập lại.

## Lịch sử sửa đổi

| Ngày | Phiên bản | Tác giả | Tóm tắt |
| --- | --- | --- | --- |
| 2026-11-04 | 0.1 | opencode / người dùng | Bản nháp đầu tiên cho đổi mật khẩu mobile theo ID-008. |
| 2026-11-04 | 1.0 | người dùng | Approved; chốt lối vào từ Profile, trường xác nhận và việc giữ phiên sau khi đổi. |
