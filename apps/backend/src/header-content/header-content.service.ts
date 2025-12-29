import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHeaderContentDto } from './dto/create-header-content.dto';
import { UpdateHeaderContentDto } from './dto/update-header-content.dto';

@Injectable()
export class HeaderContentService {
  constructor(private prisma: PrismaService) {}

  async create(createHeaderContentDto: CreateHeaderContentDto) {
    // If this is set to active, deactivate all others
    if (createHeaderContentDto.isActive !== false) {
      await this.prisma.headerContent.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.headerContent.create({
      data: {
        ...createHeaderContentDto,
        navItems: createHeaderContentDto.navItems as any,
      },
    });
  }

  async findAll() {
    return this.prisma.headerContent.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActive() {
    const content = await this.prisma.headerContent.findFirst({
      where: { isActive: true },
    });

    if (!content) {
      // Return default content if none is active
      return {
        logo: '/logos/loho.png',
        logoAlt: 'فیدار تجارت سوبا',
        navItems: [
          { href: '/', label: 'خانه' },
          { href: '/cars', label: 'خودروها' },
          { href: '/blog', label: 'مقالات' },
          { href: '/news', label: 'اخبار' },
          { href: '/about', label: 'درباره ما' },
          { href: '/contact', label: 'تماس با ما' },
          { href: '/feedback', label: 'انتقادات و پیشنهادات' },
        ],
        ctaText: 'دریافت مشاوره',
        ctaLink: '/contact',
        isActive: true,
      };
    }

    return content;
  }

  async findOne(id: string) {
    const content = await this.prisma.headerContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Header content not found');
    }

    return content;
  }

  async update(id: string, updateHeaderContentDto: UpdateHeaderContentDto) {
    await this.findOne(id);

    // If this is set to active, deactivate all others
    if (updateHeaderContentDto.isActive === true) {
      await this.prisma.headerContent.updateMany({
        where: { isActive: true, id: { not: id } },
        data: { isActive: false },
      });
    }

    const updateData: any = { ...updateHeaderContentDto };
    if (updateHeaderContentDto.navItems) {
      updateData.navItems = updateHeaderContentDto.navItems as any;
    }

    return this.prisma.headerContent.update({
      where: { id },
      data: updateData,
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    // Deactivate all others
    await this.prisma.headerContent.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate this one
    return this.prisma.headerContent.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.headerContent.delete({
      where: { id },
    });
  }
}

