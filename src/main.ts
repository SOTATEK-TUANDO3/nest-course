import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { constants } from './app/constants/common.constant';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.enableCors();

  // swagger
  if (
    process.env.APP_ENVIRONMENT === constants.APP_ENVIRONMENT.LOCAL ||
    process.env.APP_ENVIRONMENT === constants.APP_ENVIRONMENT.DEVELOPMENT
  ) {
    const config = new DocumentBuilder()
      .setTitle(`${process.env.APP_NAME} Swagger`)
      .setDescription('The MetaBrief API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
