import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.setGlobalPrefix(process.env.BASE_URL as string);
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ISP-SYSTEM API')
    .setDescription('REST API Documentation')
    .setVersion('1.0')
    .addBearerAuth() // 🔥 JWT Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
  app.useStaticAssets(
    join(process.cwd(), process.env.DESTINATION || 'uploads'),
    {
      prefix: `${process.env.BASE_URL}/${process.env.DESTINATION}/`,
    },
  );
  await app.listen(process.env.PORT!);

  console.log(
    `📘 Swagger available at: http://localhost:${process.env.PORT!}/swagger`,
  );
}
bootstrap();
