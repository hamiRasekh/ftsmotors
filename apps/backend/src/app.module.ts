import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CarsModule } from './cars/cars.module';
import { ArticlesModule } from './articles/articles.module';
import { NewsModule } from './news/news.module';
import { ContactModule } from './contact/contact.module';
import { TicketsModule } from './tickets/tickets.module';
import { ChatModule } from './chat/chat.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { PagesModule } from './pages/pages.module';
import { HealthModule } from './health/health.module';
import { UploadModule } from './upload/upload.module';
import { HomeContentModule } from './home-content/home-content.module';
import { HeaderContentModule } from './header-content/header-content.module';
import { FooterContentModule } from './footer-content/footer-content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    CarsModule,
    ArticlesModule,
    NewsModule,
    ContactModule,
    TicketsModule,
    ChatModule,
    FeedbacksModule,
    PagesModule,
    HealthModule,
    UploadModule,
    HomeContentModule,
    HeaderContentModule,
    FooterContentModule,
  ],
})
export class AppModule {}

