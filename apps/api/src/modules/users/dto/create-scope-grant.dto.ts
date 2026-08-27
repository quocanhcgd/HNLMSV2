import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

/** POST /users/{id}/scope-grants — cấp phạm vi truy cập (api-spec). Ít nhất 1 đối tượng. */
export class CreateScopeGrantDto {
  @ApiPropertyOptional({ example: '1f2e...' })
  @IsOptional()
  @IsUUID('4')
  branchId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  classId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  studentId?: string;

  @ApiPropertyOptional({ example: '2026-09-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ example: '2027-08-31T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}
