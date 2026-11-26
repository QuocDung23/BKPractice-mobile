# MOB-RANK-001 — Bảng xếp hạng XP trên mobile

Trạng thái: Draft  
Ngày: 2026-11-26

## Mục tiêu và phạm vi

Thay dữ liệu mẫu của màn Ranking bằng dữ liệu từ `GET /api/leaderboard` qua API Gateway. Sinh viên
đã đăng nhập xem Top 3, các hạng tiếp theo theo trang và vị trí của chính mình trong bảng xếp hạng
XP toàn trường theo tuần hoặc tháng.

Màn hiện tại đã có giao diện Ranking nhưng dữ liệu là hằng số. Các lựa chọn `My class`, `Faculty`,
`All time`, thông báo tăng hạng và các điểm số trong mock chưa có nguồn từ API; không được trình bày
chúng như dữ liệu thật.

## Tác nhân

- **Sinh viên đang đăng nhập:** tài khoản có role `STUDENT` và đủ điều kiện hoạt động theo backend.
- **API Gateway và Learning Service:** xác thực Bearer access token, lấy bảng hạng và trả hồ sơ công
  khai tối thiểu cho các hàng cần hiển thị.

## Hợp đồng backend đã khảo sát

Nguồn chuẩn là [spec backend Leaderboard](../../../../../BKPractice-backend/.docs/specs/02-learning/leaderboard/spec.md)
(Approved), [controller](../../../../../BKPractice-backend/apps/learning-service/src/modules/leaderboard/leaderboard.controller.ts),
[logic](../../../../../BKPractice-backend/apps/learning-service/src/modules/leaderboard/leaderboard.ts),
và [route proxy Gateway](../../../../../BKPractice-backend/apps/api-gateway/src/application/proxy/gateway-proxy.constants.ts).

### Request

```http
GET /api/leaderboard?period=week&page=1&limit=10
Authorization: Bearer <accessToken>
Accept: application/json
```

| Query | Hợp đồng |
| --- | --- |
| `period` | `week` hoặc `month`; mặc định backend là `week`. |
| `page` | Số nguyên từ 1; mặc định 1. |
| `limit` | Số nguyên từ 1 đến 50; mặc định 10. Mobile dùng 10. |

Request đi qua API client hiện có, được gửi kèm Bearer token và tự dùng cơ chế refresh phiên hiện có
khi gặp `401`. Không gửi role, user ID hay header định danh do client tự đặt. Gateway chuyển tiếp
`GET /api/leaderboard` tới Learning và đặt `Cache-Control: private, no-store`.

### Response `200`

```ts
type LeaderboardEntry = {
  userId: string;
  displayName: string;
  avatar: string | null;
  rank: number | null;
  xp: number;
  solved: number;
};

type LeaderboardResponse = {
  period: "week" | "month";
  from: string;        // ISO datetime, inclusive
  to: string;          // ISO datetime, exclusive
  generatedAt: string; // ISO datetime
  top: LeaderboardEntry[];  // tối đa 3 người đầu bảng
  rows: LeaderboardEntry[]; // trang đang xem, bắt đầu từ hạng 4
  totalItems: number;        // tổng số hàng sau Top 3, không gồm Top 3
  page: number;              // trang đã chuẩn hóa bởi backend
  limit: number;
  me: LeaderboardEntry;      // luôn có hồ sơ người xem
};
```

`rank` chỉ có thể `null` ở `me`: người xem đủ điều kiện nhưng chưa có XP trong kỳ sẽ nhận `rank: null`,
`xp: 0`, `solved: 0`. `top` có thể có ít hơn ba phần tử. `rows` được phân trang độc lập sau Top 3;
`totalItems` không phải tổng số người trong toàn bảng. Backend giới hạn trang vượt quá cuối về trang
cuối hợp lệ. Thứ tự response là thứ tự xếp hạng chính thức; client không sắp xếp lại.

Backend xếp sinh viên đang hoạt động có XP từ bài đã giải trong kỳ trên bài đã xuất bản, chưa xóa.
XP giảm dần; khi bằng XP, thời điểm giải gần nhất trong kỳ sớm hơn đứng trước, sau đó dùng ID tăng
dần. Kỳ tuần bắt đầu thứ Hai và kỳ tháng bắt đầu ngày 1 theo giờ Việt Nam; `from` inclusive, `to`
exclusive. Hồ sơ hàng công khai chỉ gồm `displayName` và `avatar` cùng ID cần để định danh bản ghi.

### Lỗi đã xác nhận

| Trạng thái / mã | Ý nghĩa và hành vi mobile |
| --- | --- |
| `400` | Query không hợp lệ. Với query do app tạo, hiển thị lỗi có thể hiểu được; không coi là bảng rỗng. |
| `401` | Phiên thiếu/hết hạn/không hợp lệ. Dùng refresh một lần theo API client hiện tại; nếu thất bại thì luồng phiên đưa người dùng về đăng nhập. |
| `403 LEADERBOARD_STUDENT_REQUIRED` | Tài khoản không có role `STUDENT`. Hiển thị trạng thái không có quyền; không hiển thị thành công rỗng. |
| `403 LEADERBOARD_VIEWER_INELIGIBLE` | Người xem không đủ điều kiện hoạt động; hiển thị trạng thái không có quyền. |
| `503 LEADERBOARD_PROFILES_UNAVAILABLE` | Không lấy được hồ sơ phụ thuộc; cho phép thử lại. |
| Lỗi mạng / `5xx` | Hiển thị lỗi có thể thử lại, không thay bằng dữ liệu mẫu. |

API client hiện ánh xạ lỗi theo status và không giữ `code` backend trong `AuthFailure`; nếu cần phân
biệt hai mã `403` trên bằng thông báo khác nhau thì phải cập nhật riêng hợp đồng xử lý lỗi trước khi
triển khai. Phạm vi Draft này chỉ yêu cầu trạng thái không có quyền chung.

## Yêu cầu chức năng

- **MOB-RANK-FR-001 — Truy cập có phiên:** Chỉ tải bảng khi phiên mobile đã đăng nhập. Gọi API qua
  API client hiện có bằng Bearer token; tôn trọng cơ chế refresh và chặn route hiện hành.
- **MOB-RANK-FR-002 — Chọn kỳ:** Mặc định hiển thị kỳ tuần. Người dùng có thể chuyển giữa tuần và
  tháng, lần lượt gửi `period=week` và `period=month`. Đổi kỳ đưa trang về 1 và không hiển thị kết
  quả của kỳ trước như dữ liệu kỳ mới.
- **MOB-RANK-FR-003 — Đọc bảng và phân trang:** Gửi `page` và `limit=10`. Hiển thị Top 3 riêng với
  danh sách từ hạng 4; cung cấp điều khiển trang tiếp/trước khi còn trang. Tổng số trang tính từ
  `totalItems` và `limit`, không cộng Top 3. Dùng `page` backend trả về làm trang hiện hành.
- **MOB-RANK-FR-004 — Hiển thị nguồn thật:** Render `rank`, `displayName`, `avatar`, `xp` và `solved`
  từ response. Avatar `null` dùng initials từ tên hiển thị. Không tạo tên, điểm, số bài, hạng hoặc
  biến động thứ hạng giả; không sắp xếp lại response.
- **MOB-RANK-FR-005 — Vị trí người xem:** Dùng `me` để người xem luôn tìm được vị trí của mình.
  Người dùng chỉ xuất hiện một lần: dùng Top 3 nếu hạng 1–3; dùng hàng trong trang nếu hàng đó đang
  hiển thị; nếu không nằm trong phần đang hiển thị thì dùng thẻ cá nhân ghim như thiết kế hiện tại.
  Khi `me.rank` là `null`, hiển thị trạng thái chưa được xếp hạng cùng 0 XP và 0 bài.
- **MOB-RANK-FR-006 — Trạng thái tải và lỗi:** Có trạng thái đang tải, lỗi có thể thử lại, lỗi không
  có quyền và trạng thái rỗng. Lỗi response không hợp lệ không được chuyển thành danh sách rỗng.
  Thử lại tải lại đúng kỳ/trang đang chọn.
- **MOB-RANK-FR-007 — Bảng rỗng và bảng ngắn:** Nếu không ai có XP trong kỳ, Top 3 và `rows` rỗng;
  vẫn hiển thị trạng thái `me` chưa xếp hạng. Nếu có dưới ba người, chỉ render số mục backend trả
  về, không dựng chỗ trống thành người dùng.
- **MOB-RANK-FR-008 — Không lưu dữ liệu riêng:** Không log token hay response hồ sơ; không lưu bảng
  hạng vào store bền vững hoặc dùng chung giữa các user. Chỉ dùng `userId` nội bộ để nhận diện `me`
  và tránh hiển thị trùng; không đưa ID đó lên giao diện.
- **MOB-RANK-FR-009 — Giới hạn theo API:** Phạm vi phát hành đầu hỗ trợ bảng toàn trường theo tuần
  và tháng. Không hiển thị bộ lọc lớp/khoa, `All time`, hay thông báo tăng/giảm hạng vì API chưa trả
  dữ liệu tương ứng.

## Tiêu chí nghiệm thu

| Mã | Kịch bản | Kết quả mong đợi |
| --- | --- | --- |
| MOB-RANK-AC-001 | Mở Ranking khi có phiên `STUDENT` | Request `GET /api/leaderboard?period=week&page=1&limit=10` có Bearer; giao diện dùng dữ liệu response. |
| MOB-RANK-AC-002 | Chuyển tuần sang tháng khi đang ở trang sau | Gửi query tháng, về trang 1, không còn mục hoặc trạng thái loading/lỗi của tuần. |
| MOB-RANK-AC-003 | API trả Top 3, `rows`, `me` | Top 3 và trang danh sách giữ thứ tự API; điểm XP, số bài, tên và avatar khớp response. |
| MOB-RANK-AC-004 | `me` có hạng 1–3, ở trang hiện tại, ngoài trang hiện tại | Thông tin người xem xuất hiện đúng một lần trong phần bảng đang quan sát được. |
| MOB-RANK-AC-005 | `me.rank=null`, bảng có hoặc không có người khác | Hiển thị 0 XP/0 bài và trạng thái chưa xếp hạng; bảng khác vẫn hiện nếu response có dữ liệu. |
| MOB-RANK-AC-006 | Có hơn 10 hàng sau Top 3 | Điều khiển trang lấy đúng `page`, `totalItems`, `limit`; trang cuối dừng đúng lúc, không tự thêm Top 3 vào tổng hàng. |
| MOB-RANK-AC-007 | Lỗi mạng, `503`, `403`, `401` | Không hiện thành công rỗng hoặc mock; thông báo phù hợp và thử lại chỉ xuất hiện cho lỗi có thể hồi phục. `401` theo luồng refresh hiện hành. |
| MOB-RANK-AC-008 | API trả JSON thiếu/sai kiểu trường | Hiển thị lỗi response có thể thử lại; không crash và không diễn giải thành bảng rỗng. |
| MOB-RANK-AC-009 | Avatar `null`, Top 3 ít hơn ba người, bảng rỗng | Initials hoặc trạng thái rỗng đúng; không render dữ liệu mẫu. |
| MOB-RANK-AC-010 | Chuyển tài khoản hoặc unmount màn | Response cũ không hiện cho user/kỳ/trang khác; không lưu response/token ngoài vòng đời phiên. |

## Ngoài phạm vi

- Thay đổi backend, xếp hạng theo lớp/khoa, bảng mọi thời gian hoặc lịch sử thứ hạng.
- Cộng XP, thay quy tắc tie-break, xếp hạng theo quiz, bạn bè, hồ sơ công khai đầy đủ hoặc quản trị.
- Thay cơ chế phiên, API Gateway, HTTP client dùng chung hoặc thêm thư viện quản lý dữ liệu.

## Câu hỏi mở / giả định cần xác nhận

Draft này giả định màn hiện tại được điều chỉnh để chỉ còn chọn tuần/tháng và xóa các bộ lọc
`My class`/`Faculty`/`All time`, cùng nội dung tăng hạng giả. Nếu sản phẩm cần các lựa chọn đó thì
phải bổ sung hợp đồng backend và duyệt lại phạm vi trước khi triển khai. Chưa có Accepted ADR riêng
cho ranking; áp dụng [kiến trúc mobile](../../architecture/README.md) và [quy trình](../../../agent/working-agreement.md).
