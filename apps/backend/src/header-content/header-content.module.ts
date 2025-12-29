import { Module } from '@nestjs/common';
import { HeaderContentService } from './header-content.service';
import { HeaderContentController } from './header-content.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HeaderContentController],
  providers: [HeaderContentService],
  exports: [HeaderContentService],
})
export class HeaderContentModule {}

