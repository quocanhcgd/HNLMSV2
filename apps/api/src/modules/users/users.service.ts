import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordService } from './password.service';
import { User } from './user.entity';

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  phone?: string | null;
}

/** Dữ liệu an toàn để trả ra ngoài (không bao giờ chứa passwordHash). */
export type SafeUser = Omit<User, 'passwordHash' | 'twoFaSecret'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly password: PasswordService,
  ) {}

  async create(input: CreateUserInput): Promise<SafeUser> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }
    const hash = await this.password.hash(input.password);
    let user: User;
    try {
      user = await this.users.save(
        this.users.create({
          email: input.email.toLowerCase().trim(),
          passwordHash: hash,
          fullName: input.fullName.trim(),
          role: input.role,
          avatarUrl: input.avatarUrl ?? null,
          phone: input.phone ?? null,
          status: 'Active',
        }),
      );
    } catch (err) {
      // PK/unique conflict race — ví dụ 2 request cùng email
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('Email đã được sử dụng');
      }
      throw err;
    }
    return this.toSafeUser(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email: email.toLowerCase().trim() } });
  }

  /** Chỉ dùng khi cần xác thực — lấy cả password_hash. */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  /** Trả SafeUser hoặc throw — dùng cho controller. */
  async getByIdOrThrow(id: string): Promise<SafeUser> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return this.toSafeUser(user);
  }

  async validateCredentials(email: string, plainPassword: string): Promise<SafeUser | null> {
    const user = await this.findByEmailWithPassword(email);
    if (!user || user.status === 'Inactive' || user.status === 'Suspended') return null;
    const ok = await this.password.compare(plainPassword, user.passwordHash);
    if (!ok) return null;
    return this.toSafeUser(user);
  }

  async markLastLogin(id: string, ip?: string): Promise<void> {
    await this.users.update(id, {
      lastLoginAt: new Date(),
      lastLoginIp: ip ?? null,
    });
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash: _ph, twoFaSecret: _ts, ...safe } = user;
    return safe;
  }
}
