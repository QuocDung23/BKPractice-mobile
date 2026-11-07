# Chuyển HTTP client sang axios

Date: 2026-11-04
Spec: .docs/pm/specs/auth/spec.md (Approved)
Plan: .docs/pm/specs/auth/plan.md (Approved)

## What was done

- `package.json`, `package-lock.json` — thêm `axios@^1.21.0` bằng `npx expo install axios`.
  Axios là JS thuần nên không cần development build và không ảnh hưởng Expo Go.
- `src/lib/auth/api-client.ts` → `src/lib/http/api-client.ts` — thay `fetch` bằng một axios instance
  dùng chung cho mọi service:
  - `baseURL` lấy từ `apiBaseUrl` (gateway), timeout 15 giây.
  - Giữ nguyên chữ ký public `ApiRequest`, `requestJson<T>()`, `TokenRefresher`,
    `setTokenRefresher` nên ba repository và toàn bộ hook/domain/component không phải sửa.
  - `validateStatus: () => true` để mọi status do axios resolve, nhờ đó logic ánh xạ
    `400/401/403/404/409/429/5xx` hiện có được giữ nguyên thay vì viết lại bằng
    `try/catch AxiosError` cho từng nhánh.
  - Gộp `messageForStatus`/`codeForStatus` thành một hàm map; bỏ biến `accessToken` trung gian
    trong `requestJson`.
  - Giữ nguyên Bearer, `X-Client-Type: mobile`, single-flight refresh khi 401, và cách map lỗi
    mạng thành `AuthFailure("network", ...)`.
  - Không log header, body hay token.
- `src/lib/http/config.ts` — tách `apiBaseUrl` (gateway, `EXPO_PUBLIC_API_BASE_URL`) ra khỏi
  `lib/auth` để `lib/http` không phụ thuộc ngược vào auth.
- `src/lib/auth/config.ts` — chỉ còn `mobileAuthRedirectUrl`, re-export `apiBaseUrl` để hook
  Microsoft giữ nguyên import.
- `src/lib/http/failure.ts` — tách phần ánh xạ lỗi khỏi `api-client.ts` để service khác dùng
  chung: `failureByStatus` và `apiFailureFor(status, unauthorizedCode)`.
- `src/lib/http/index.ts` — barrel export `requestJson`, `setTokenRefresher`, `apiBaseUrl`,
  `apiFailureFor` và các type.
- Ba repository auth (`auth-repository.ts`, `password-reset-repository.ts`,
  `profile-repository.ts`) — đổi import `requestJson` sang `@/lib/http`.
- `src/hooks/auth/use-session-restore.ts` — import `setTokenRefresher` từ `@/lib/http` (auth
  barrel không còn export hàm của module khác).
- `.docs/pm/specs/auth/plan.md` — cập nhật bốn câu còn ghi "fetch" thành axios/HTTP client để
  plan không mâu thuẫn với code.
- `src/lib/auth/profile-repository.ts` không đổi: PUT lên R2 presigned tiếp tục dùng `fetch`
  (phương án 1A đã duyệt) vì không cần auth, refresh hay interceptor và tránh axios ghi đè
  `Content-Type` đã ký.

## Functions

### `sendRequest` — `src/lib/http/api-client.ts`

- What it does: gửi một request tới gateway qua axios instance, gắn `Accept`,
  `Content-Type` (khi có body), `X-Client-Type` (khi `mobile`) và `Authorization` (khi có token).
- Input: `ApiRequest`, `accessToken?: string`.
- Output: `Promise<AxiosResponse<unknown>>`.
- Why it is written this way: giữ nguyên toàn bộ header và cách gọi cũ để các repository không phải
  sửa; lỗi transport (mất mạng, timeout) được đổi thành `AuthFailure` mã `network` tại đúng ranh
  giới `lib`.

### `requestJson<T>` — `src/lib/http/api-client.ts`

- What it does: gọi `sendRequest`, khi gặp `401` và có access token thì làm mới đúng một lần rồi
  gửi lại; sau đó ánh xạ status không phải 2xx thành `AuthFailure` và trả `response.data`.
- Input: `ApiRequest`.
- Output: `Promise<T>`.
- Why it is written this way: giữ đúng hành vi của bản `fetch` cũ (retry một lần, single-flight qua
  `refreshInFlight`, `expectEmpty`/`204` trả `undefined`) nên rủi ro regression thấp.

### `refreshAccessToken` — `src/lib/http/api-client.ts`

- What it does: gọi `tokenRefresher` và gộp các lần gọi đồng thời vào một promise.
- Input: không có.
- Output: `Promise<AuthTokens | null>`.
- Why it is written this way: dùng `refreshInFlight ??=` để chỉ tạo promise khi chưa có, giữ quy
  tắc "nhiều request 401 không mở hai lần refresh" trong spec.

### `apiFailureFor` — `src/lib/http/failure.ts`

- What it does: ánh xạ HTTP status sang `AuthFailure` có mã và thông báo an toàn.
- Input: `status: number`, `unauthorizedCode: AuthFailureCode`.
- Output: `AuthFailure`.
- Why it is written this way: nằm ngoài `lib/auth` để module courses/problems/community sau này
  import lại thay vì viết bản riêng; bảng `failureByStatus` giữ các nhánh 403/404/409/429, còn 401
  và 5xx xử lý riêng vì phụ thuộc ngữ cảnh. Spec MOB-AUTH-FR-014 yêu cầu thông báo chung, không lộ
  tài khoản có tồn tại hay không.

## Technologies used

| Technology | Where | Why |
| --- | --- | --- |
| axios | `src/lib/http/api-client.ts` | Người dùng chọn axios cho lớp HTTP; cho timeout/instance tập trung và interceptor về sau. |
| TypeScript generics | `requestJson<T>`, `sendRequest` | Giữ kiểu response cụ thể cho từng repository như bản `fetch`. |

## Checks

- `npx tsc --noEmit`: passed
- `npm run lint`: passed (không còn warning `import/no-named-as-default-member` sau khi đổi sang
  named import `create`)

## Left undone

- Chưa chạy kiểm thử tay các luồng đăng nhập, refresh, profile, OTP vì cần backend chạy; checklist
  nằm trong plan đã duyệt.
- Upload avatar vẫn dùng `fetch` tới R2 presigned (phương án 1A).
- `src/lib/http/` giờ chứa cả config, client và map lỗi; service khác chỉ cần import từ
  `@/lib/http`, không cần đụng `lib/auth`.
- Unit test T006/T013 vẫn chưa có test runner trong repo.
