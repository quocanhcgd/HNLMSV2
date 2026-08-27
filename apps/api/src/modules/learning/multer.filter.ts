import { Catch, ExceptionFilter, PayloadTooLargeException } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { MulterError } from 'multer';

/** MulterError → HTTP hợp lý: LIMIT_FILE_SIZE → 413 (api-spec), khác → 400.
 *  Chỉ bắt MulterError — các exception khác (ValidationPipe...) đi qua Nest mặc định. */
@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse();
    if (exception.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ statusCode: 413, message: 'Vượt giới hạn 500MB' });
      return;
    }
    if (exception.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({ statusCode: 400, message: 'Trường file không hợp lệ' });
      return;
    }
    throw new PayloadTooLargeException(exception.message);
  }
}
