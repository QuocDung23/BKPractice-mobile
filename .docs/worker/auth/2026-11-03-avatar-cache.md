# Giữ avatar Home và Profile khi chuyển màn hình

Ngày: 2026-11-03
Spec: .docs/pm/specs/auth/spec.md (Approved)
Plan: .docs/pm/specs/auth/plan.md

## Nội dung đã thực hiện

- `src/hooks/auth/use-profile.ts` — dùng cache hồ sơ theo người dùng khi request đang tải lại, lưu kết quả tải thành công vào cache và giữ dữ liệu cache nếu tải lại gặp lỗi.
- `src/hooks/auth/use-profile-editor.ts` — cập nhật cache hồ sơ bằng dữ liệu server trả về sau khi lưu hồ sơ thành công.
- `src/lib/profile/profile-cache.ts` và `src/lib/profile/index.ts` — cung cấp cache theo người dùng cho hook và trình chỉnh sửa hồ sơ.
- `src/components/home/home-view.tsx` và `src/components/profile/profile-view.tsx` — hiển thị avatar bằng `expo-image` với cache `memory-disk`.

## Hàm và component

### `useProfile` — `src/hooks/auth/use-profile.ts`

- Chức năng: Trả về hồ sơ người dùng hiện đăng nhập cùng trạng thái tải lại.
- Đầu vào: Phiên đăng nhập hiện tại, lấy qua `useAuthSession`.
- Đầu ra: Hồ sơ đã cache nếu có, cùng trạng thái đang tải, lỗi và hàm tải lại.
- Lý do: Khi chuyển về màn hình, avatar hiện ngay trong lúc request hiện có cập nhật hồ sơ mới nhất.

### `useProfileEditor` — `src/hooks/auth/use-profile-editor.ts`

- Chức năng: Quản lý các trường hồ sơ có thể chỉnh sửa và avatar.
- Đầu vào: `Profile` đã tải qua tham số và phiên đăng nhập hiện tại.
- Đầu ra: Trạng thái cùng các thao tác chỉnh sửa; khi lưu thành công, cache hồ sơ dùng chung được cập nhật.
- Lý do: Màn hình tiếp theo có thể dùng dữ liệu server vừa lưu mà không cần chờ một request hồ sơ khác.

### `HomeView` — `src/components/home/home-view.tsx`

- Props: Không có.
- Hiển thị màn hình Home và avatar hiện tại; dùng chữ viết tắt tên làm phương án dự phòng.

### `ProfileView` — `src/components/profile/profile-view.tsx`

- Props: Không có.
- Hiển thị màn hình Profile và avatar hiện tại; dùng chữ viết tắt tên hoặc chỉ báo đang tải làm phương án dự phòng.

## Công nghệ sử dụng

| Công nghệ | Vị trí | Lý do |
| --- | --- | --- |
| `expo-image` | Hiển thị avatar ở Home và Profile | Thành phần ảnh của Expo SDK đang cài hỗ trợ cache trong bộ nhớ và trên disk giữa các lần render lại. |
| `Map` trong bộ nhớ | `src/lib/profile/profile-cache.ts` | Chia sẻ hồ sơ mới nhất giữa các màn trong phiên chạy ứng dụng mà không sao chép dữ liệu server vào auth store. |

## Kiểm tra

- `npx tsc --noEmit`: đạt.
- `npm run lint`: đạt.

## Chưa thực hiện

- Chưa kiểm tra chuyển màn hình thủ công trên thiết bị.
