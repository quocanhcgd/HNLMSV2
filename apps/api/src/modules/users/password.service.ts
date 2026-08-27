import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

/**
 * T016 deliverable: băm mật khẩu bằng bcrypt (cost 10).
 * Dùng bcryptjs (pure JS) — không cần node-gyp/build native trên Windows.
 */
@Injectable()
export class PasswordService {
  private readonly rounds = 10;

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
