import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceDefaultOptions from 'ormconfig';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.guard';
import { MailModule } from './Mailer/mail.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './orders/order.module';
import { AuthUserModule } from './auth/auth-user.module';
import { WishProductModule } from './wish-product/wish-product.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceDefaultOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    StripeModule.forRootAsync(),
    AuthModule,
    MailModule,
    ProductModule,
    AdminModule,
    UploadModule,
    OrderModule,
    AuthUserModule,
    WishProductModule,
    ReviewModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
