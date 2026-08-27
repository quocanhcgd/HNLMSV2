import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

/** DTO Learning Content (T049–T051) — contract docs/05-api/api-spec.yaml §LEARNING. */

export class ListContentQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page_size?: number;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional() @IsUUID('4')
  class_id?: string;

  @ApiPropertyOptional({ enum: ['public', 'class', 'private'] })
  @IsOptional() @IsIn(['public', 'class', 'private'])
  access_scope?: 'public' | 'class' | 'private';
}

/** Các field multipart ngoài file (POST /learning/content). */
export class CreateContentDto {
  @ApiProperty() @IsString() @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ enum: ['document', 'video', 'audio', 'presentation', 'interactive', 'ebook'] })
  @IsOptional() @IsIn(['document', 'video', 'audio', 'presentation', 'interactive', 'ebook'])
  content_type?: 'document' | 'video' | 'audio' | 'presentation' | 'interactive' | 'ebook';

  @ApiPropertyOptional({ enum: ['public', 'class', 'private'], default: 'class' })
  @IsOptional() @IsIn(['public', 'class', 'private'])
  access_scope?: 'public' | 'class' | 'private';

  @ApiPropertyOptional({ type: [String], format: 'uuid', description: 'Danh sách lớp được gán (class scope)' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : value))
  @IsArray() @IsUUID('4', { each: true })
  class_ids?: string[];

  @ApiPropertyOptional({ example: 'document' }) @IsOptional() @IsString() @MaxLength(100)
  category?: string;
}

export class UpdateContentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ enum: ['public', 'class', 'private'] })
  @IsOptional() @IsIn(['public', 'class', 'private'])
  access_scope?: 'public' | 'class' | 'private';

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  @IsOptional() @IsArray() @IsUUID('4', { each: true })
  class_ids?: string[];
}
