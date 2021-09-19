import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 binds ValidationPipe to the entire application
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 👈 automatically transform payloads (e.g. convert id to `number` from `string`)
      transformOptions: {
        enableImplicitConversion: true, // 👈  transform based on TS type
      },
    }),
  );

  // 👇 apply transform to all responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 👇 apply PrismaClientExceptionFilter to entire application, requires `httpAdapterHost` because it extends `BaseExceptionFilter`
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Memo: Swagger config
  const config = new DocumentBuilder()
    .setTitle('Prisma Day - NestJS Prisma Workshop')
    .setDescription('Building a REST API with NestJS and Prisma')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { customSiteTitle: 'Prisma Day' });

  await app.listen(3000);
}
bootstrap();
