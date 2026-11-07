# MOB-AUTH-004 Kế hoạch giới hạn mobile cho sinh viên

Trạng thái: Approved  
Ngày: 2026-11-07

Đặc tả: [spec.md](./spec.md) — Approved 1.0. Checklist: [tasks.md](./tasks.md).
Spec và plan đã được duyệt ngày 2026-11-07; triển khai source theo working agreement.

## 1. Hướng thực hiện và tệp ảnh hưởng

Giữ auth context, repository, SecureStore và banner lỗi đang có. Bổ sung quy tắc nhỏ trong domain,
chặn trước khi nhận phiên, thay vì tạo hệ thống RBAC trên mobile.

| Tệp/lớp | Thay đổi dự kiến |
| --- | --- |
| `src/domain/auth/types.ts` | Thêm `mobile_access_denied` vào `AuthFailureCode` |
| `src/domain/auth/use-cases.ts` | Kiểm tra `STUDENT` dùng chung; sắp lại thứ tự xác nhận/lưu phiên; dọn phiên bị loại; kiểm tra lại `/me` sau refresh |
| `src/domain/auth/index.ts` | Chỉ cập nhật export nếu có helper cần dùng từ lớp ngoài |
| `src/lib/auth/auth-repository.ts` | Kiểm tra cấu trúc `roles` ở ranh giới response; tắt HTTP tự retry cho `/me` dùng xác nhận phiên |
| `src/stores/auth-session.tsx` | Giữ lý do kết thúc phiên tạm thời cho màn hình đăng nhập; bảo vệ cập nhật từ công việc cũ |
| `src/hooks/auth/use-session-restore.ts` | Không nuốt lý do từ chối; dọn state và chuyển thông báo tới đăng nhập; không trả token cho HTTP khi bị loại |
| `src/hooks/auth/use-sign-in.ts`, `use-microsoft-sign-in.ts` | Chỉ nhận phiên đã được domain kiểm tra; giữ lỗi riêng, xoá thông báo lần trước khi bắt đầu lần mới |
| `src/components/auth/sign-in-view.tsx` | Hiển thị thông báo từ restore/refresh bằng banner hiện có, cùng lỗi của hai phương thức đăng nhập |
| `src/components/navigation/root-navigation.tsx` | Không mount màn hình bảo vệ trước khi phiên được chấp nhận; giữ route trong `src/app/` mỏng |
| `tests/auth/` và script test tối thiểu | Regression test chạy code domain/thành phần nối phiên với repository/storage giả |

Tên helper/API nội bộ được chốt khi triển khai. `domain` không import React/Expo/storage cụ thể;
`lib` không import store; hook nối domain, hạ tầng và store. Không tạo màn hình riêng cho admin hoặc
giảng viên. Không đổi nhãn identifier, PKCE hay thiết kế form ngoài việc nối thông báo.

## 2. Đăng nhập mật khẩu và Microsoft

1. Gọi endpoint login/exchange như hiện tại, giữ token trả về trong bộ nhớ tạm.
2. Đọc `/api/auth/me` bằng access token vừa nhận, không tự refresh request này.
3. Ở repository, từ chối response có `roles` không phải mảng chuỗi bằng lỗi dữ liệu có kiểm soát.
4. Ở domain, kiểm tra `roles.includes("STUDENT")`; mảng hợp lệ nhưng thiếu role trả
   `AuthFailure("mobile_access_denied", <thông báo trong spec>)`, không giả lập HTTP `403`.
5. Chỉ sau khi hợp lệ mới ghi token theo chính sách hiện tại và trả `AuthSession` cho hook.
6. Hook chỉ gọi `setSession` và chuyển home khi use case thành công.

Nếu bước xác nhận thất bại, không ghi token của lần đăng nhập này. Với phiên bị từ chối vai trò,
dọn token cũ thuộc lần đăng nhập đó và thử logout cặp token vừa nhận; lỗi logout không che lỗi gốc.
Lỗi response/mạng không bị biến thành lỗi vai trò. Không ghi role/permission vào request login.

Truy vết: SA-FR-001/002/005/006/007/009; SA-AC-001–005/012.

## 3. Restore và refresh

- Dùng cùng bước đọc user/kiểm tra vai trò cho restore trực tiếp từ token lưu và sau refresh.
- Restore access token hết hạn vẫn chỉ thử refresh một lần theo auth hiện hành. Lỗi
  `mobile_access_denied` phải đi tới hook với lý do rõ ràng, không bị catch chung chuyển thành
  `null` làm mất thông báo.
- Refresh luôn đọc `/me` bằng access token mới, kể cả caller truyền `currentUser`. Dùng user cũ
  để kiểm tra cùng `userId`, không dùng lại vai trò cũ. Chỉ sau xác nhận mới commit token/state
  và cho HTTP retry request gốc.
- `readCurrentUser` không tự tham gia HTTP refresh/retry: restore điều khiển nhánh refresh của
  chính nó; `/me` trong refresh trả `401` thì kết thúc theo lỗi xác thực, không gọi refresh lần nữa.
- Token đã xoay nhưng không xác nhận được `/me` không được nhận thành phiên hợp lệ. Lỗi tạm thời
  tiếp tục theo chính sách hiện hành; việc giữ token chờ thử lại theo D1 của MOB-AUTH-003 không
  được tự thêm vào đợt này.
- Khi xác nhận thiếu `STUDENT`, dọn phiên mobile liên quan và thử logout bằng cặp token hiện hành
  (cặp mới nếu vừa refresh); không cho request nghiệp vụ đang chờ retry bằng token đó.

Thay đổi này thêm một request `/me` cho mỗi refresh, không thêm request kiểm tra role cho từng
API nghiệp vụ. Không triển khai listener foreground/timer mới.

Truy vết: SA-FR-003/004/005/007; SA-AC-006–010/012.

## 4. State, điều hướng và thông báo

- Giữ lý do `mobile_access_denied` trong bộ nhớ ở auth context khi restore/refresh loại phiên.
  Màn hình đăng nhập đọc và hiển thị bằng banner hiện có; không lưu lý do cùng token.
- Xoá thông báo khi bắt đầu đăng nhập lần mới hoặc rời luồng đăng nhập. Không xoá ngay khi redirect
  khiến người dùng chưa kịp đọc. Hook Microsoft giữ nguyên mã lỗi này, không đổi thành lỗi SSO hết hạn.
- Khi phiên bị loại, chuyển state về signed out ngay cả khi logout từ xa lỗi. Xoá storage thất bại
  phải có lỗi và thao tác thử lại; giữ các màn hình được bảo vệ bị chặn.
- Không chỉ phủ loading lên màn hình đã mount. Dùng cơ chế navigator phù hợp SDK tại thời điểm
  triển khai để màn hình bảo vệ không mount trước khi xác nhận; kiểm tra cả deep link trực tiếp.
- Ràng buộc kết quả async và dọn token vào lần đăng nhập/phiên nguồn; kết quả cũ không được ghi
  hay xoá phiên mới. Nếu cơ chế vòng đời phiên của MOB-AUTH-003 đã có thì tái sử dụng. Nếu chưa có,
  dùng bảo vệ tối thiểu cho các đường bị sửa, không triển khai toàn bộ bộ điều phối refresh của Draft đó.

Truy vết: SA-FR-005/006/008; SA-AC-010/011/013.

## 5. Kiểm chứng

Ưu tiên `node:test` và TypeScript sẵn có, mock repository/storage để chạy code sản phẩm.
Không cài framework test native mới chỉ cho điều kiện role; dùng runner chung nếu repo đã có
khi bắt đầu triển khai. Kiểm tra thứ tự gọi: `/me` và kiểm tra role phải trước `store.write`,
`setSession`, điều hướng home và retry request nghiệp vụ.

Bao phủ toàn bộ SA-AC-001–013, thêm assert cho:

- Role `student` không được coi là `STUDENT`; `studentId` có giá trị không thay thế role.
- Không gọi `store.write` cho phiên bị loại; cleanup vẫn chạy khi logout throw.
- Refresh dùng vai trò mới thay vì `currentUser`; `/me` không refresh đệ quy.
- Lỗi storage được báo đúng, callback từ lần cũ không xoá phiên mới.

Sau source changes, chạy regression test, `npx tsc --noEmit` và `npm run lint`. Kiểm thử thủ công
qua Gateway trên iOS và Android: mật khẩu, Microsoft, phiên admin/giảng viên lưu từ trước,
refresh sau khi bỏ role, deep link và thông báo. Cần tài khoản test đại diện cho các tổ hợp role;
không tự sửa role dữ liệu thật để kiểm thử. Test mock không thay bằng chứng thiết bị/backend.

Trước khi sửa API Expo/React Native/Router, đọc major `expo` thực tế trong `package.json` và docs
đúng phiên bản; không lấy SDK ghi trong tài liệu Draft cũ làm nguồn quyết định.

## 6. Thứ tự và điều kiện hoàn thành

1. Đã duyệt spec/plan ngày 2026-11-07; tham chiếu và ngoại lệ thông báo trong auth spec/plan đã
   cập nhật. Đối chiếu source hiện tại; đọc agent rules và docs Expo khớp SDK trước khi sửa source.
2. Thêm regression test tái hiện admin/giảng viên được nhận phiên và token được lưu quá sớm.
3. Sửa quy tắc domain, ranh giới repository, thứ tự login/restore/refresh và cleanup.
4. Nối lý do từ chối vào state/banner; chặn mount màn hình bảo vệ và completion cũ.
5. Chạy test/typecheck/lint, kiểm thử tích hợp hai nền tảng; ghi phần thiếu bằng chứng thành task mở.
6. Ghi `.docs/worker/auth/YYYY-MM-DD-student-only-access.md`, cập nhật checklist đúng phần đã làm.

Không sửa backend/web, không cài dependency, không xử lý toàn bộ MOB-AUTH-003 trong kế hoạch này.
Nếu cần đổi hợp đồng backend hoặc gặp mâu thuẫn tài liệu mới, nêu rõ trước khi mở rộng phạm vi.
