/** Claim chuẩn của token JWT (access + refresh). */
export interface JwtPayload {
  /** user id (users.id). */
  sub: string;
  email: string;
  role: string;
  /** 'access' | 'refresh' — chống dùng nhầm loại token. */
  type: 'access' | 'refresh';
}
