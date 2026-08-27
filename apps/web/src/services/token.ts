/**
 * Access token giữ ở memory (spec: refresh nằm trong HTTP-only cookie — browser tự gửi).
 * Khi refresh thất bại (cookie hết hạn/đã logout) → notify để AuthProvider về trạng thái anonymous.
 */
let accessToken: string | null = null;
let authFailureHandler: (() => void) | null = null;

export const tokenStore = {
  get: (): string | null => accessToken,
  set: (t: string | null): void => {
    accessToken = t;
  },
  setAuthFailureHandler: (fn: (() => void) | null): void => {
    authFailureHandler = fn;
  },
  notifyAuthFailure: (): void => {
    authFailureHandler?.();
  },
};
