# MOB-AUTH-004 Giới hạn ứng dụng mobile cho sinh viên

Trạng thái: Approved  
Ngày: 2026-11-07

## Mục tiêu và quan hệ với tài liệu hiện có

Chỉ cho tài khoản có vai trò `STUDENT` sử dụng các màn hình được bảo vệ của BKPractice mobile.
Tài khoản chỉ có `ADMIN`, `LECTURER` hoặc không có `STUDENT` được hướng dẫn sử dụng web.
Tài khoản có nhiều vai trò vẫn được vào nếu có `STUDENT`, với giao diện sinh viên hiện có.

Đây là bổ sung điều kiện truy cập cho [auth đã Approved](../auth/spec.md), không xây luồng quản
trị hoặc giảng viên. Spec này đã Approved ngày 2026-11-07 cùng [plan](./plan.md) và
[tasks](./tasks.md); source chỉ được sửa theo working agreement. Tham chiếu và ngoại lệ thông báo
đã bổ sung vào [auth spec](../auth/spec.md) và [auth plan](../auth/plan.md).

## Hiện trạng đã kiểm tra

- `/api/auth/me` đã trả `roles`; `AuthUser` đã giữ `roles: string[]`.
- `readSession` trong `src/domain/auth/use-cases.ts` chưa kiểm tra vai trò.
- Đăng nhập mật khẩu và Microsoft đang ghi token trước khi đọc người dùng hiện tại.
- `restoreSession` chưa loại phiên admin/giảng viên được lưu từ bản app cũ.
- `refreshSession` có thể tái sử dụng `currentUser` mà không đọc lại `/me`.
- `useSessionRestore` đang bỏ thông tin lỗi khi restore/refresh thất bại.
- Navigation chỉ xét trạng thái phiên; lớp phủ loading hiện không ngăn các màn hình phía dưới mount.

## Chính sách đề xuất

| Vai trò do `/api/auth/me` trả về | Được dùng mobile |
| --- | --- |
| `STUDENT` | Có |
| `ADMIN` | Không |
| `LECTURER` | Không |
| `ADMIN`, `LECTURER` | Không |
| `STUDENT` cùng `ADMIN` và/hoặc `LECTURER` | Có, dùng chức năng sinh viên |
| Mảng rỗng hoặc chỉ có vai trò khác | Không |
| Thiếu `roles`, sai kiểu hoặc phần tử không phải chuỗi | Không; lỗi response không hợp lệ |

So khớp chính xác mã `STUDENT` theo hợp đồng backend; không tự chuyển hoa/thường, suy luận từ
MSSV/email, tên vai trò hiển thị hoặc giải mã JWT để thay thế `/me`.
Các quy tắc tài khoản `ACTIVE`, xác thực credential và phân quyền tài nguyên hiện có vẫn áp dụng.

## Yêu cầu chức năng

- **SA-FR-001 — Một quy tắc truy cập:** domain sở hữu quy tắc kiểm tra `STUDENT`; dùng chung cho
  đăng nhập mật khẩu, Microsoft, khôi phục phiên và refresh. Không đặt logic vai trò riêng ở từng form.
- **SA-FR-002 — Xác nhận trước khi nhận phiên:** sau khi có token, phải đọc `/api/auth/me` và
  kiểm tra vai trò trước khi ghi token của lần đăng nhập mới, gọi `setSession` hoặc vào home.
  Microsoft giữ hành vi lưu phiên hiện tại; mật khẩu giữ tuỳ chọn Nhớ tôi.
- **SA-FR-003 — Phiên đã lưu:** khởi động app phải kiểm tra cùng quy tắc trước khi hoàn tất restore.
  Phiên cũ không có `STUDENT` phải bị loại dù access token còn hạn. Nếu cần refresh, kiểm tra
  `/me` bằng token mới trước khi chấp nhận phiên.
- **SA-FR-004 — Refresh:** refresh thành công phải đọc lại `/me`, xác nhận đúng người dùng của
  phiên đang làm mới và kiểm tra `STUDENT` trước khi commit token/state hoặc retry request gốc.
  Không dùng vai trò cache để quyết định. Mất `STUDENT` thì kết thúc phiên mobile.
- **SA-FR-005 — Dọn phiên bị từ chối:** không giữ token/state của phiên bị loại, xoá token cũ
  thuộc phiên đó nếu có; thử logout họ refresh token liên quan bằng endpoint hiện có. Lỗi logout
  không được cho phép vào app hoặc thay thế thông báo từ chối. Không thu hồi phiên web/thiết bị khác.
- **SA-FR-006 — Thông báo:** trường hợp xác thực thành công nhưng không có `STUDENT` hiển thị:
  `This app is currently available to students only. Please use the web version.`
  Dùng banner đăng nhập hiện có cho cả mật khẩu và Microsoft; restore/refresh bị loại đưa về
  đăng nhập với cùng thông báo. Không mở web tự động hoặc thêm URL chưa được cấu hình.
- **SA-FR-007 — Phân biệt lỗi:** có mã lỗi domain riêng `mobile_access_denied`; không đổi mọi
  HTTP `403` thành lỗi này. Sai credential vẫn dùng lỗi chung hiện có; thiếu/sai kiểu `roles`
  là lỗi dữ liệu không hợp lệ. `/me` lỗi mạng không được bị diễn giải thành thiếu quyền sinh viên.
- **SA-FR-008 — Chặn màn hình:** khi chưa xác nhận xong hoặc đã bị từ chối, màn hình được bảo vệ
  không được mount/tải dữ liệu, kể cả mở qua deep link. Kết quả restore/refresh hoặc dọn phiên cũ
  về muộn không được khôi phục hay xoá một phiên đăng nhập mới.
- **SA-FR-009 — Tương thích:** giữ Bearer, SecureStore, `X-Client-Type: mobile`, luồng PKCE và
  hợp đồng backend. Không gửi role do client chọn, không log token/mật khẩu, không thêm dependency
  để kiểm tra một vai trò.

Thông báo từ chối do restore/refresh chỉ nằm trong bộ nhớ, giữ tới khi người dùng bắt đầu lần
đăng nhập mới hoặc rời luồng đăng nhập; không lưu vào SecureStore. Nếu xoá storage lỗi, vẫn chặn
màn hình bảo vệ, báo lỗi lưu trữ có thể thử lại và không tuyên bố đã xoá token thành công.

## Tiêu chí nghiệm thu

| Mã | Kịch bản | Kết quả mong đợi |
| --- | --- | --- |
| SA-AC-001 | Mật khẩu đúng, có `STUDENT`, bật/tắt Nhớ tôi | Vào home; chỉ lưu token khi bật Nhớ tôi |
| SA-AC-002 | Mật khẩu đúng, chỉ `ADMIN`, chỉ `LECTURER`, hoặc cả hai | Ở đăng nhập, thông báo dùng web; không nhận/lưu phiên bị loại |
| SA-AC-003 | Microsoft trả user có/không có `STUDENT` | Cho phép hoặc từ chối theo cùng quy tắc; không có đường bỏ qua |
| SA-AC-004 | `STUDENT` cùng vai trò khác | Vào giao diện sinh viên, không thêm menu quản trị/giảng viên |
| SA-AC-005 | `roles` rỗng, vai trò lạ; `roles` thiếu hoặc sai kiểu | Không vào app; thông báo đúng loại từ chối hoặc response lỗi |
| SA-AC-006 | Mở lại app có phiên admin/giảng viên từ bản cũ, access token còn hạn | Dọn phiên, về đăng nhập và hiện thông báo dùng web |
| SA-AC-007 | Phiên cũ hết access token, refresh còn hợp lệ nhưng không có `STUDENT` | Refresh và đọc `/me`, rồi loại phiên; không mount home |
| SA-AC-008 | Đang dùng app, bỏ `STUDENT` trên backend rồi xảy ra refresh | Đọc vai trò mới, dọn phiên, không retry request nghiệp vụ |
| SA-AC-009 | `/me` trả `401` trong bước xác nhận sau refresh | Không lặp refresh hoặc treo do chờ chính refresh đang chạy |
| SA-AC-010 | Logout khi loại phiên lỗi mạng; hoặc SecureStore xoá thất bại | Vẫn chặn app; lỗi logout không che thông báo, lỗi storage được báo và cho thử lại |
| SA-AC-011 | Mở deep link tới màn hình bảo vệ khi restore chưa xong hoặc bị loại | Màn hình không mount, không gọi API nghiệp vụ |
| SA-AC-012 | Sai mật khẩu, `/me` lỗi mạng, API nghiệp vụ trả `403` | Không báo nhầm thiếu quyền sinh viên; giữ xử lý lỗi hiện có |
| SA-AC-013 | Phản hồi từ chối/dọn phiên cũ về sau khi đã đăng nhập phiên mới | Không ghi đè/xoá phiên mới, không hiện thông báo của lần cũ |

## Ranh giới và phụ thuộc

- Đây là điều kiện sử dụng app chính thức. Backend tiếp tục phân quyền từng API; kế hoạch này
  không đặt lệnh cấm phát hành mọi mobile token ở Identity/Gateway và không sửa repo backend/web.
- Vai trò bị thu hồi được phát hiện ở lần xác nhận `/me` tiếp theo nêu trên. Không cam kết đẩy
  thay đổi vai trò tức thời hoặc thêm kiểm tra theo timer/foreground trong đợt này.
- [Refresh-token MOB-AUTH-003](../refresh-token/spec.md) đang Draft. Không tự triển khai toàn bộ
  plan đó hoặc chốt D1 về lỗi mạng/`503` trong việc này. Giữ chính sách lỗi refresh hiện hành;
  chỉ thêm điều kiện vai trò vào đường refresh. Nếu MOB-AUTH-003 được triển khai trước, tích hợp
  vào đường commit/kết thúc phiên của nó, không tạo thêm bộ điều phối phiên.
- Sau khi được duyệt, bổ sung tham chiếu và ngoại lệ thông báo thiếu quyền vào spec/plan auth:
  credential sai dùng thông báo chung; xác thực đúng nhưng không được dùng mobile có thông báo riêng.
- Kiến trúc áp dụng: [architecture](../../architecture/README.md). `.docs/adr/` hiện chỉ có README,
  chưa có Accepted ADR riêng cho phân vai trò mobile.

## Quyết định đã duyệt

Người dùng duyệt ngày 2026-11-07: chính sách có `STUDENT` thì được vào, bao gồm tài khoản nhiều
vai trò; phạm vi mobile ở SA-FR-001–009; nội dung thông báo tiếng Anh theo giao diện hiện tại; và
kế hoạch kiểm chứng bên dưới. Triển khai source là lượt riêng theo [plan](./plan.md) và
[tasks](./tasks.md).

## Lịch sử sửa đổi

| Ngày | Phiên bản | Tác giả | Tóm tắt |
| --- | --- | --- | --- |
| 2026-11-07 | 0.1 | opencode / người dùng | Bản nháp đầu tiên cho giới hạn ứng dụng mobile dành cho sinh viên. |
| 2026-11-07 | 1.0 | người dùng | Approved chính sách `STUDENT`, phạm vi MOB-AUTH-004 và thông báo dùng bản web. |
