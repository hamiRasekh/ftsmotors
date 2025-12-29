import { Module } from '@nestjs/common';
import { FooterContentService } from './footer-content.service';
import { FooterContentController } from './footer-content.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FooterContentController],
  providers: [FooterContentService],
  exports: [FooterContentService],
})
export class FooterContentModule {}

