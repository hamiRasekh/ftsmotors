import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Security - Configure helmet to work with CORS
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false, // Allow embedding for development
  }));
  app.use(compression());

  // CORS Configuration
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  // Get CORS origins from environment variable (comma-separated)
  // Or use default origins
  let corsOrigins: string[] | boolean | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
  
  if (process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.trim() !== '') {
    // Parse comma-separated origins from environment variable
    corsOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(origin => origin.length > 0);
  } else {
    // In development, allow all origins for easier local network access
    // This allows access from other devices on the same network (e.g., IP addresses like 192.168.x.x)
    if (isDevelopment) {
      corsOrigins = true; // Allow all origins in development
    } else {
      // Default origins for production - include all frontend domains
      corsOrigins = [
        frontendUrl,
        'https://ftsmotors.ir',
        'https://www.ftsmotors.ir',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://frontend:3000',
      ];
    }
  }
  
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
  });
  
  // Log CORS configuration
  if (corsOrigins === true) {
    console.log('CORS enabled for ALL origins (development mode)');
  } else if (Array.isArray(corsOrigins)) {
    console.log(`CORS enabled for origins: ${corsOrigins.join(', ')}`);
  } else {
    console.log('CORS enabled with custom origin function');
  }

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('FTS Motors API')
    .setDescription('API documentation for FTS Motors')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
