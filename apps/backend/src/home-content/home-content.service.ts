import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeContentDto } from './dto/create-home-content.dto';
import { UpdateHomeContentDto } from './dto/update-home-content.dto';

@Injectable()
export class HomeContentService {
  constructor(private prisma: PrismaService) {}

  async create(createHomeContentDto: CreateHomeContentDto) {
    // If this is set to active, deactivate all others
    if (createHomeContentDto.isActive !== false) {
      await this.prisma.homeContent.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.homeContent.create({
      data: createHomeContentDto,
    });
  }

  async findAll() {
    return this.prisma.homeContent.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActive() {
    const content = await this.prisma.homeContent.findFirst({
      where: { isActive: true },
    });

    if (!content) {
      // Return default content if none is active
      return {
        tagline: 'تحقق یک رویا',
        title: 'شریک شما در تجارت خودرو',
        subtitle: 'شما را با بهترین خودروهای لوکس آلمانی و کره‌ای متصل می‌کنیم',
        backgroundImage: '/photo_2025-12-28_18-06-14.jpg',
        logo: '/logos/loho.png',
        ctaText: 'دریافت مشاوره',
        ctaLink: '/contact',
        isActive: true,
      };
    }

    return content;
  }

  async findOne(id: string) {
    const content = await this.prisma.homeContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Home content not found');
    }

    return content;
  }

  async update(id: string, updateHomeContentDto: UpdateHomeContentDto) {
    await this.findOne(id);

    // If this is set to active, deactivate all others
    if (updateHomeContentDto.isActive === true) {
      await this.prisma.homeContent.updateMany({
        where: { isActive: true, id: { not: id } },
        data: { isActive: false },
      });
    }

    return this.prisma.homeContent.update({
      where: { id },
      data: updateHomeContentDto,
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    // Deactivate all others
    await this.prisma.homeContent.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate this one
    return this.prisma.homeContent.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.homeContent.delete({
      where: { id },
    });
  }
}

