import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser()); // refresh cookie HTTP-only (T017)
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // OpenAPI (T013': contract /license/* đánh dấu FUTURE — D9)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EduCenter LMS API')
    .setDescription(
      'API tài liệu OpenAPI. License: contract /license/* là FUTURE (D9) — trả license mặc định (dev/evaluation), chưa enforce constraint.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Xác thực: register (T016), login/refresh/logout + /me/context (T017), RBAC guards (T018)')
    .addTag('license', 'FUTURE (D9) — contract chờ hệ thống quản lý license')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.API_PORT ?? 4001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[lms-api] listening on http://localhost:${port}/api — health: /api/health, docs: /api/docs`);
}

void bootstrap();
