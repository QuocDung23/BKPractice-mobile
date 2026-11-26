# Kế hoạch — Bảng xếp hạng XP trên mobile

Trạng thái: Draft  
Ngày: 2026-11-26  
Spec: [spec.md](./spec.md) — Draft; chưa được mở cổng sửa `src/`.

## Triển khai dự kiến

1. Sau khi spec được Approved, đối chiếu lại backend spec/controller/logic và API client mobile.
   Giữ request `GET /api/leaderboard` với `period`, `page`, `limit=10`; không thêm tham số không có
   trong backend contract.
2. Thêm model `LeaderboardEntry`, `LeaderboardPeriod`, `LeaderboardPage` và interface repository
   trong `src/domain/ranking/`. Domain chỉ định nghĩa dữ liệu và thao tác đọc bảng, không phụ thuộc
   React Native, HTTP hay Expo.
3. Thêm repository trong `src/lib/ranking/` dùng `fetchLearning` từ `src/lib/learning/` để gọi API
   và decode response từ `unknown`. Kiểm tra chuỗi kỳ/ngày, mảng top/rows, số nguyên không âm, rank,
   trường hồ sơ nullable và metadata phân trang; lỗi shape phải đi theo lỗi response hiện hành.
   Dùng API client hiện tại cho Bearer, refresh, timeout và ánh xạ status; không thêm dependency.
4. Thêm hook ở `src/hooks/ranking/` dựa trên `useLearningRequest`, với key gắn user/period/page để
   request cũ không ghi đè lựa chọn mới. Hook trả response, retry và trạng thái; giữ page selection
   trong view hoặc hook theo pattern tối thiểu hiện hành. Không đưa response server vào store client.
5. Thay mock trong `src/components/ranking/ranking-view.tsx` bằng dữ liệu hook. Giữ route
   `src/app/ranking.tsx` mỏng và giữ style/điều hướng hiện tại khi tương thích. Chuyển bộ chọn sang
   tuần/tháng; render Top 3, các hàng trang hiện tại, `me`, pager, loading/error/empty. Không hiển thị
   mock filters, điểm mẫu, tên mẫu hay biến động hạng.
6. Đảm bảo cùng một user chỉ được render một lần trong phần bảng quan sát được: Top 3 nếu thuộc Top
   3; hàng danh sách nếu nằm trong trang; nếu nằm ngoài phần đang xem thì dùng thẻ cá nhân. Dùng
   `userId` nội bộ để so khớp, không render ID. Avatar rỗng dùng initials.
7. Sau khi được duyệt và triển khai, kiểm tra các trạng thái, pagination, đổi kỳ và phản hồi lỗi trên
   iOS/Android; chạy `npx tsc --noEmit` và `npm run lint`; ghi work note tại
   `.docs/worker/ranking/YYYY-MM-DD-<task>.md` theo working agreement.

## Lớp và tệp dự kiến

| Lớp | Vị trí dự kiến | Trách nhiệm |
| --- | --- | --- |
| Domain | `src/domain/ranking/` | Kiểu kỳ, entry/response, interface repository và use case đọc bảng nếu cần theo pattern nghiệp vụ. |
| Lib | `src/lib/ranking/` | HTTP repository và decode response, dùng API/response helper hiện có. |
| Hook | `src/hooks/ranking/` | Gắn phiên, trạng thái request, đổi period/page và retry với UI. |
| Components | `src/components/ranking/` | Màn Ranking và thành phần con cần thiết; không gọi API trực tiếp. |
| Route | `src/app/ranking.tsx` | Giữ route mỏng, render component gốc. |

Chỉ tạo barrel `index.ts` tại module được import từ module khác. Có thể chỉnh số lượng file sau khi
đọc kỹ cấu trúc hiện hành, nhưng giữ chiều phụ thuộc trong [architecture](../../architecture/README.md).

## Kiểm tra sau khi được duyệt

- Kiểm tra decode response cho Top 3, rows, `me.rank=null`, avatar `null`, mảng rỗng, metadata sai và
  ngày/kỳ không hợp lệ; dùng test runner sẵn có nếu repo bổ sung hoặc đã có vào thời điểm triển khai.
- Kiểm tra request query, Bearer/refresh qua API client hiện tại, chuyển kỳ, trang cuối, retry và
  user đổi phiên; không log token hoặc hồ sơ.
- Chạy `npx tsc --noEmit` và `npm run lint` theo workflow mobile. Kiểm tra hiển thị trên iOS và
  Android; ghi lỗi môi trường/backend ngoài phạm vi nếu có.

## Phụ thuộc và rủi ro

- Spec cần được duyệt trước khi sửa source. Câu hỏi còn mở là các filter mock hiện tại có phải yêu
  cầu sản phẩm hay không; backend chỉ hỗ trợ phạm vi toàn trường theo tuần/tháng.
- `apiFailureFor` hiện chỉ ánh xạ status, không giữ mã lỗi backend. Phạm vi này dùng thông báo 403
  chung; nếu UX cần thông báo riêng theo `LEADERBOARD_*`, cần quyết định mở rộng API failure model.
- Backend có thể trả `me` ngoài trang và phân trang chỉ áp dụng cho hàng sau Top 3; không tính tổng
  hạng bằng cách cộng Top 3 vào `totalItems`.
- API đặt `Cache-Control: private, no-store`; không thêm cache bền vững hoặc fallback demo.

## Ranh giới

Không thay đổi backend, frontend web, quy tắc XP, phiên auth hay navigation ngoài route Ranking.
