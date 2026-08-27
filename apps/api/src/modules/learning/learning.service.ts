import { BadRequestException, ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { createReadStream, existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import { basename, extname, join, resolve } from 'path';
import { Repository, In } from 'typeorm';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { SchoolClass } from '../academic/class.entity';
import { OrganizationService } from '../org/organization.service';
import { ScopeContextService } from '../scopes/scope-context.service';
import { UsersService } from '../users/users.service';
import { ContentClassLink } from './content-class-link.entity';
import { ContentVersion } from './content-version.entity';
import { LearningContent } from './learning-content.entity';

/** MIME/extension allowlist thay cho anti-virus scanner (DEVIATION D9 — chờ ops). */
const ALLOWED = new Set([
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/rtf', 'text/csv', 'text/markdown', 'application/rtf',
  'application/zip', 'text/html', 'application/epub+zip',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/x-msvideo',
  'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/aac', 'audio/x-m4a',
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
]);
const EXT_ALLOWED = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'md', 'odt',
  'zip', 'html', 'htm', 'epub', 'mp4', 'webm', 'mov', 'mkv', 'avi', 'mp3', 'wav', 'm4a', 'ogg', 'aac',
  'png', 'jpg', 'jpeg', 'gif', 'webp',
]);
const MAX_SIZE = 500 * 1024 * 1024; // 500MB (api-spec 413)

/** Đường dẫn gốc lưu file: env LMS_UPLOAD_DIR hoặc apps/api/uploads (prod /var/lms/uploads). */
export function uploadRootPath(): string {
  return process.env.LMS_UPLOAD_DIR ?? resolve(__dirname, '..', '..', '..', 'uploads');
}

function inferContentType(mime: string, ext: string): LearningContent['contentType'] {
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.includes('powerpoint') || (ext === 'ppt' || ext === 'pptx')) return 'presentation';
  if (mime === 'application/epub+zip' || ext === 'epub') return 'ebook';
  if (mime === 'application/zip' || ext === 'html' || ext === 'htm' || ext === 'zip') return 'interactive';
  return 'document';
}

/** T049–T051 — Learning & Content: upload local, phân quyền tải theo access_scope. */
@Injectable()
export class LearningService implements OnModuleInit {
  private readonly uploadRoot: string;

  constructor(
    @InjectRepository(LearningContent) private readonly contents: Repository<LearningContent>,
    @InjectRepository(ContentVersion) private readonly versions: Repository<ContentVersion>,
    @InjectRepository(ContentClassLink) private readonly links: Repository<ContentClassLink>,
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
    private readonly orgs: OrganizationService,
    private readonly scopeCtx: ScopeContextService,
    private readonly users: UsersService,
  ) {
    this.uploadRoot = uploadRootPath();
  }

  onModuleInit(): void {
    for (const dir of [join(this.uploadRoot, 'tmp'), join(this.uploadRoot, 'learning')]) {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    }
  }

  getTmpDir(): string {
    return join(this.uploadRoot, 'tmp');
  }

  // ================= LIST (T052) =================

  async listContent(
    input: { page: number; pageSize: number; classId?: string; accessScope?: string },
    user: JwtPayload,
  ) {
    const qb = this.contents.createQueryBuilder('c');
    const allowed = this.scopeCtx.branchIds();
    if (allowed !== null && allowed.length > 0) {
      qb.andWhere('(c.branch_id IS NULL OR c.branch_id IN (:...allowed) OR c.owner_id = :uid)', { allowed, uid: user.sub });
    }
    if (input.classId) {
      qb.andWhere('EXISTS (SELECT 1 FROM content_class_links l WHERE l.content_id = c.id AND l.class_id = :classId)', {
        classId: input.classId,
      });
    }
    if (input.accessScope) qb.andWhere('c.access_scope = :scope', { scope: input.accessScope });
    const total = await qb.clone().getCount();
    const rows = await qb
      .orderBy('c.created_at', 'DESC')
      .skip((input.page - 1) * input.pageSize)
      .take(input.pageSize)
      .getMany();
    // nạp relations riêng (tránh lỗi TypeORM DISTINCT + relations + pagination)
    const ids = rows.map((r) => r.id);
    const data = ids.length
      ? await this.contents.find({ where: { id: In(ids) }, relations: { classLinks: { class: true }, owner: true } })
      : [];
    const byId = new Map(data.map((d) => [d.id, d]));
    return { data: ids.map((i) => byId.get(i)!).filter(Boolean), meta: { page: input.page, pageSize: input.pageSize, total } };
  }

  // ================= UPLOAD (T050) =================

  async upload(file: { originalname: string; mimetype: string; size: number; path: string }, dto: {
    title: string;
    content_type?: string;
    access_scope?: string;
    class_ids?: string[];
    category?: string;
  }, user: JwtPayload) {
    if (!file) throw new BadRequestException('Thiếu file tải lên');
    if (file.size > MAX_SIZE) throw new BadRequestException('Vượt giới hạn 500MB');
    const ext = extname(file.originalname).slice(1).toLowerCase();
    const mime = file.mimetype.toLowerCase();
    if (!ALLOWED.has(mime) && !EXT_ALLOWED.has(ext)) {
      unlinkSync(file.path);
      throw new BadRequestException(`Loại file không được phép (${file.originalname})`);
    }
    const contentType = dto.content_type ? (dto.content_type as LearningContent['contentType']) : inferContentType(mime, ext);
    const accessScope = (dto.access_scope ?? 'class') as LearningContent['accessScope'];

    // scope branch: user bị giới hạn đúng 1 chi nhánh → gắn branch; còn lại (null hoặc []) → toàn quyền
    const allowed = this.scopeCtx.branchIds();
    const restricted = allowed !== null && allowed.length > 0;
    let branchId: string | null = null;
    if (restricted) {
      if (allowed.length === 1) branchId = allowed[0];
      else throw new BadRequestException('Cần gắn học liệu vào chi nhánh — vui lòng cấp scope 1 chi nhánh');
    }
    // class_ids phải tồn tại và nằm trong scope (nếu bị giới hạn)
    const classIds = dto.class_ids ?? [];
    if (classIds.length) {
      const cls = await this.classes.find({ where: classIds.map((id) => ({ id })) });
      if (cls.length !== classIds.length) throw new BadRequestException('Có lớp không tồn tại');
      if (restricted) {
        for (const c of cls) {
          if (!allowed.includes(c.branchId)) throw new ForbiddenException('Lớp nằm ngoài phạm vi được cấp');
        }
      }
    }

    const org = await this.orgs.getDefault();
    const content = this.contents.create({
      organizationId: org.id,
      branchId,
      ownerId: user.sub,
      title: dto.title.trim(),
      contentType,
      accessScope,
      category: dto.category ?? null,
      subject: null,
      status: 'published',
      approvalStatus: 'approved',
      usagePolicy: { download_allowed: true, preview: true, watermark: false },
    });
    const saved = await this.contents.save(content);

    const safeName = basename(file.originalname).replace(/[^\w.\- ]+/g, '_').slice(0, 120);
    const finalDir = join(this.uploadRoot, 'learning', saved.id, 'v1');
    mkdirSync(finalDir, { recursive: true });
    const fileRef = `learning/${saved.id}/v1/${safeName}`;
    const finalPath = join(this.uploadRoot, fileRef);
    try {
      renameSync(file.path, finalPath);
    } catch {
      unlinkSync(file.path);
      await this.contents.delete(saved.id);
      throw new BadRequestException('Không lưu được file');
    }

    saved.fileRef = fileRef;
    saved.fileSizeBytes = file.size;
    saved.mimeType = mime || null;
    saved.fileHash = await this.sha256(finalPath);
    await this.contents.save(saved);

    await this.versions.save(this.versions.create({
      contentId: saved.id,
      version: 1,
      fileRef,
      fileHash: saved.fileHash,
      changeNote: 'Tải lên ban đầu',
      createdBy: user.sub,
    }));
    if (classIds.length) {
      await this.links.save(classIds.map((classId) => this.links.create({ contentId: saved.id, classId })));
    }
    return this.getById(saved.id);
  }

  // ================= UPDATE (T052) =================

  async updateContent(id: string, dto: { title?: string; access_scope?: string; class_ids?: string[] }, user: JwtPayload) {
    const content = await this.getById(id);
    if (content.ownerId !== user.sub && !(await this.isAdmin(user))) {
      throw new ForbiddenException('Chỉ chủ sở hữu hoặc quản trị viên mới sửa được học liệu');
    }
    if (dto.title !== undefined) content.title = dto.title.trim();
    if (dto.access_scope !== undefined) content.accessScope = dto.access_scope as LearningContent['accessScope'];
    await this.contents.save(content);
    if (dto.class_ids !== undefined) {
      await this.links.delete({ contentId: id });
      if (dto.class_ids.length) {
        const cls = await this.classes.find({ where: dto.class_ids.map((cid) => ({ id: cid })) });
        if (cls.length !== dto.class_ids.length) throw new BadRequestException('Có lớp không tồn tại');
        await this.links.save(dto.class_ids.map((classId) => this.links.create({ contentId: id, classId })));
      }
    }
    return this.getById(id);
  }

  async getById(id: string): Promise<LearningContent> {
    const content = await this.contents.findOne({
      where: { id },
      relations: { classLinks: { class: true }, owner: true },
    });
    if (!content) throw new NotFoundException('Không tìm thấy học liệu');
    return content;
  }

  // ================= DOWNLOAD + AUTHORIZATION (T051) =================

  async resolveDownload(id: string, user: JwtPayload): Promise<{ content: LearningContent; absolutePath: string }> {
    const content = await this.getById(id);
    if (!(await this.canAccess(content, user))) {
      throw new ForbiddenException('Không có quyền tải học liệu này');
    }
    if (!content.fileRef) throw new NotFoundException('Học liệu chưa có file');
    const absolutePath = resolve(this.uploadRoot, content.fileRef);
    if (!existsSync(absolutePath)) throw new NotFoundException('File học liệu không còn tồn tại trên máy chủ');
    return { content, absolutePath };
  }

  /** T051 — ai được tải: public → tất cả; class → chủ sở hữu / teacher lớp / học viên đang ghi danh / academic_manager; private → chủ sở hữu + admin. */
  private async canAccess(content: LearningContent, user: JwtPayload): Promise<boolean> {
    const rbac = await this.users.effectiveRbac(user.sub, user.role);
    if (rbac.permissions.includes('*')) return true;

    const allowed = this.scopeCtx.branchIds();
    if (allowed !== null && allowed.length > 0 && content.branchId && !allowed.includes(content.branchId)) return false;

    if (content.accessScope === 'public') return true;
    if (content.ownerId === user.sub) return true;
    if (content.accessScope === 'private') return false;

    // access_scope === 'class'
    if (rbac.roles.includes('academic_manager')) return true;
    const linkRows = await this.links.find({ where: { contentId: content.id } });
    if (!linkRows.length) return false;
    const classIds = linkRows.map((l) => l.classId);
    const teach = await this.classes
      .createQueryBuilder('cl')
      .innerJoin('class_teachers', 'ct', 'ct.class_id = cl.id')
      .where('cl.id IN (:...classIds)', { classIds })
      .andWhere('ct.teacher_id = :uid', { uid: user.sub })
      .getCount();
    if (teach > 0) return true;
    const enrolled = await this.classes
      .createQueryBuilder('cl')
      .innerJoin('enrollments', 'e', 'e.class_id = cl.id')
      .innerJoin('students', 's', 's.id = e.student_id')
      .where('cl.id IN (:...classIds)', { classIds })
      .andWhere('s.user_id = :uid', { uid: user.sub })
      .andWhere('e.status IN (:...statuses)', { statuses: ['pending_payment', 'active'] })
      .getCount();
    return enrolled > 0;
  }

  private async isAdmin(user: JwtPayload): Promise<boolean> {
    const rbac = await this.users.effectiveRbac(user.sub, user.role);
    return rbac.permissions.includes('*');
  }

  private sha256(path: string): Promise<string> {
    return new Promise((resolvePromise, reject) => {
      const hash = createHash('sha256');
      const stream = createReadStream(path);
      stream.on('data', (chunk) => hash.update(chunk as Buffer));
      stream.on('end', () => resolvePromise(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
}
