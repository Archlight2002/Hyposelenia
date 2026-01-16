import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Serve static files from frontend directory
  const path = require('path');
  app.useStaticAssets(path.join(__dirname, '../../frontend/frontend'), {
    index: 'index.html',
  });

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Hyposelenia Chatrooms API')
    .setDescription('Swagger reference for the Hyposelenia realtime chat backend')
    .setVersion('1.0')
    .addTag('Chatrooms')
    .addTag('Messages')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  // 👇 Add these lines
  console.log('======================================');
  console.log('Server running at: http://localhost:3000');
  console.log('Swagger available at: http://localhost:3000/api');
  console.log('======================================');
}
bootstrap();
