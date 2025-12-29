import { Module } from '@nestjs/common';
import { HomeContentService } from './home-content.service';
import { HomeContentController } from './home-content.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HomeContentController],
  providers: [HomeContentService],
  exports: [HomeContentService],
})
export class HomeContentModule {}

