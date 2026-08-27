import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Query, Req, Res, StreamableFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import type { Response } from 'express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthedRequest } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/authz.decorators';
import { CreateContentDto, LibraryQueryDto, ListContentQueryDto, UpdateContentDto, UpdateContentProgressDto } from './learning.dto';
import { LearningService, uploadRootPath } from './learning.service';
import { MulterExceptionFilter } from './multer.filter';

const MAX_SIZE = 500 * 1024 * 1024;

/**
 * T049–T051 — Learning & Content API (contract docs/05-api/api-spec.yaml §LEARNING).
 * Phân quyền: xem/tải = content:read; upload/sửa = content:manage. DEVIATION (D9):
 * chưa có anti-virus scanner — allowlist MIME/extension + giới hạn 500MB + SHA-256 hash;
 * storage local apps/api/uploads (prod /var/lms/uploads).
 */
@ApiTags('Learning')
@UseFilters(new MulterExceptionFilter())
@Controller()
export class LearningController {
  constructor(private readonly learning: LearningService) {}

  @Get('/learning/content')
  @RequirePermissions('content:read')
  @ApiOperation({ summary: 'Danh sách học liệu (trong scope — lọc class_id / access_scope)' })
  listContent(@Query() q: ListContentQueryDto, @Req() req: AuthedRequest) {
    return this.learning.listContent(
      { page: q.page ?? 1, pageSize: Math.min(q.page_size ?? 20, 100), classId: q.class_id, accessScope: q.access_scope },
      req.user,
    );
  }

  @Post('/learning/content')
  @RequirePermissions('content:manage')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, join(uploadRootPath(), 'tmp')),
        filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
      }),
      limits: { fileSize: MAX_SIZE },
    }),
  )
  @ApiOperation({ summary: 'Tải lên học liệu mới (multipart: title + file + access_scope + class_ids[])' })
  upload(@Body() dto: CreateContentDto, @Req() req: AuthedRequest) {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) throw new BadRequestException('Thiếu file tải lên');
    return this.learning.upload(file, dto, req.user);
  }

  @Put('/learning/content/:contentId')
  @RequirePermissions('content:manage')
  @ApiOperation({ summary: 'Sửa học liệu: tiêu đề / access_scope / class_ids (chủ sở hữu hoặc admin)' })
  update(@Param('contentId') id: string, @Body() dto: UpdateContentDto, @Req() req: AuthedRequest) {
    return this.learning.updateContent(id, dto, req.user);
  }

  @Get('/learning/content/:contentId/download')
  @RequirePermissions('content:read')
  @ApiOperation({ summary: 'Tải file học liệu (403 nếu không thuộc phạm vi — public/class/private)' })
  async download(@Param('contentId') id: string, @Req() req: AuthedRequest, @Res({ passthrough: true }) res: Response) {
    const { content, absolutePath } = await this.learning.resolveDownload(id, req.user);
    const filename = content.fileRef?.split('/').pop() ?? 'download';
    res.set({
      'Content-Type': content.mimeType ?? 'application/octet-stream',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Content-Length': String(content.fileSizeBytes ?? 0),
    });
    const { createReadStream } = await import('fs');
    return new StreamableFile(createReadStream(absolutePath));
  }

  /** T055 — thư viện học viên: public + học liệu lớp đang ghi danh. */
  @Get('/learning/library')
  @RequirePermissions('content:read')
  @ApiOperation({ summary: 'Tìm kiếm thư viện (public + học liệu lớp của tôi) — q/subject/category + phân trang' })
  searchLibrary(@Query() q: LibraryQueryDto, @Req() req: AuthedRequest) {
    return this.learning.searchLibrary(
      { page: q.page ?? 1, pageSize: Math.min(q.page_size ?? 20, 100), q: q.q, subject: q.subject, category: q.category },
      req.user,
    );
  }

  /** T053/T054 — cập nhật tiến độ học liệu của học viên hiện tại. */
  @Patch('/learning/content/:contentId/progress')
  @RequirePermissions('content:read')
  @ApiOperation({ summary: 'Cập nhật tiến độ học liệu của tôi (upsert content_progress)' })
  updateProgress(@Param('contentId') id: string, @Body() dto: UpdateContentProgressDto, @Req() req: AuthedRequest) {
    return this.learning.updateContentProgress(id, dto, req.user);
  }
}
