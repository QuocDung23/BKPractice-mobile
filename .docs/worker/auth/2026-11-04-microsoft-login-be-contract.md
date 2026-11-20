# Đồng bộ Microsoft login mobile với contract Identity hiện tại

Date: 2026-11-04
Spec: .docs/pm/specs/auth/spec.md (Approved — FR-003 đang ghi query param, xem "Left undone")
Plan: .docs/pm/specs/auth/plan.md

## What was done

- `src/lib/http/api-client.ts` — thêm `requestRedirectLocation` dùng `expo/fetch` với `redirect: "manual"` để đọc header `Location` của response `3xx` mà không bị tự động đi theo redirect. Ánh xạ lỗi mạng/HTTP sang `AuthFailure` như `requestJson`.
- `src/lib/http/index.ts` — xuất `requestRedirectLocation` và type `RedirectRequest` cho lớp repository dùng.
- `src/domain/auth/repositories.ts` — thêm `startMicrosoftLogin(codeChallenge)` vào `AuthRepository`; domain vẫn không biết HTTP.
- `src/lib/auth/auth-repository.ts` — hiện thực `startMicrosoftLogin` gọi `GET /api/auth/microsoft` với `X-Client-Type: mobile` và `X-Mobile-Code-Challenge`, trả về URL Microsoft lấy từ `Location` (FR-003, khớp `AuthController.startMicrosoft` của BE).
- `src/domain/auth/use-cases.ts` — thêm use case `startMicrosoftSignIn` bọc lời gọi repository.
- `src/domain/auth/index.ts` — xuất use case mới.
- `src/hooks/auth/use-microsoft-sign-in.ts` — bỏ URL start dạng query (`client_type`, `code_challenge`); tạo PKCE, gọi use case start để lấy URL Microsoft, mở URL đó bằng `WebBrowser.openAuthSessionAsync` với deep link app, rồi đổi `loginCode` + verifier như cũ (FR-003).

## Functions

### `requestRedirectLocation` — `src/lib/http/api-client.ts`

- What it does: gửi GET không đi theo redirect, kiểm tra status `3xx`, đọc và trả header `Location`.
- Input: `RedirectRequest` gồm `path` và `headers`.
- Output: `Promise<string>` là URL redirect.
- Why it is written this way: browser hệ thống không gắn được custom header, còn BE hiện tại chỉ nhận `X-Client-Type`/`X-Mobile-Code-Challenge` qua header ở endpoint start. Gọi start bằng HTTP trước rồi mở URL Microsoft là cách duy nhất giữ đúng contract BE mà không sửa BE.

### `startMicrosoftLogin` — `src/lib/auth/auth-repository.ts`

- What it does: gọi endpoint start của Identity với client type mobile và challenge S256.
- Input: `codeChallenge` (43 ký tự base64url).
- Output: URL authorization của Microsoft.
- Why it is written this way: tập trung chi tiết endpoint/header vào adapter HTTP, giữ hook không biết format request.

### `startMicrosoftSignIn` — `src/domain/auth/use-cases.ts`

- What it does: chuyển challenge xuống `AuthRepository.startMicrosoftLogin`.
- Input: `AuthRepository`, `codeChallenge`.
- Output: URL authorization của Microsoft.
- Why it is written this way: hook gọi use case theo đúng luồng kiến trúc, không gọi thẳng repository.

### `useMicrosoftSignIn` — `src/hooks/auth/use-microsoft-sign-in.ts`

- What it does: tạo PKCE, lấy URL Microsoft từ BE, mở auth session, đọc `loginCode` từ deep link, đổi mã và lưu phiên.
- Input: không có.
- Output: trạng thái lỗi/đang chờ và `submitMicrosoftSignIn`.
- Why it is written this way: đây là chỗ duy nhất biết chi tiết browser/deep link; verifier chỉ nằm trong bộ nhớ.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| `expo/fetch` | `src/lib/http/api-client.ts` | Cần `redirect: "manual"` để đọc `Location`; fetch/XHR mặc định của React Native đi theo redirect và không trả header này. Module đã có trong package `expo`, không thêm dependency. |
| `expo-web-browser` | `src/hooks/auth/use-microsoft-sign-in.ts` | Mở URL Microsoft trong system browser và bắt deep link quay về app. |
| `expo-crypto` | `src/lib/auth/microsoft-pkce.ts` | Giữ nguyên verifier/challenge S256 đúng định dạng BE yêu cầu. |

## Checks

- `npx tsc --noEmit`: pass.
- `npm run lint`: pass.
- `npx expo export --platform ios --output-dir /tmp/bkpractice-export-microsoft`: pass, bundle iOS tạo thành công.
- Chưa chạy luồng thật trên thiết bị/backend (cần BE đang chạy và Microsoft app registration).

## Left undone

- **Chặn cuối luồng ở BE, không sửa được từ mobile:** `AuthController` hiện tại của BE chỉ nhận `X-Client-Type`/`X-Mobile-Code-Challenge` qua header (đã khớp ở mobile), nhưng sau callback Microsoft, gateway từ chối redirect về scheme app vì chỉ cho `http:`/`https:` (`gateway-proxy.service.ts`). Cần BE cho phép `bkpracticemobile://` thì `openAuthSessionAsync` mới nhận được `loginCode`.
- **Thiếu cấu hình BE:** `.env` backend chưa có `AUTH_MOBILE_LOGIN_REDIRECT_URL`; `StartMicrosoftLogin` sẽ trả `503 dependency_unavailable` khi gọi nhánh mobile. Cần thêm `AUTH_MOBILE_LOGIN_REDIRECT_URL=bkpracticemobile:///auth/callback` và cho phép scheme này khi `NODE_ENV=production`.
- **Lệch spec:** FR-003 của `.docs/pm/specs/auth/spec.md` ghi start bằng query `client_type`/`code_challenge`, trong khi BE hiện tại dùng header. Bản sửa này ưu tiên contract BE theo yêu cầu trong phiên; cần cập nhật spec/plan nếu BE sẽ giữ header.
- Khi test trên thiết bị thật, `EXPO_PUBLIC_API_BASE_URL` và `MICROSOFT_REDIRECT_URI` của BE phải trỏ tới host mà thiết bị truy cập được, không phải `localhost` của máy dev.
