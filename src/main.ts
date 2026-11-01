import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix all routes with /api/v1
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger Documentation Setup at /api/v1/docs
  const config = new DocumentBuilder()
    .setTitle('KARPI API')
    .setDescription('RESTful API documentation for KARPI IT & Computer Science Learning Platform')
    .setVersion('1.0')
    .addTag('courses', 'Courses and Categories management')
    .addTag('programs', 'Learning programs and educational initiatives')
    .addTag('events', 'Webinars, seminars, and workshops')
    .addTag('gallery', 'Authentic photos, seminar sessions, and student workshops')
    .addTag('testimonials', 'Student success stories and feedback')
    .addTag('achievements', 'Key statistics and achievements')
    .addTag('enquiries', 'Student registration and course enquiries')
    .addTag('contact', 'Contact form and institution collaboration inquiries')
    .addTag('health', 'Service health check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 KARPI API is running at http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger Docs available at http://localhost:${port}/api/v1/docs`);
}
bootstrap();

