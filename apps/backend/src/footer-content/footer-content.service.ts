import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFooterContentDto } from './dto/create-footer-content.dto';
import { UpdateFooterContentDto } from './dto/update-footer-content.dto';

@Injectable()
export class FooterContentService {
  constructor(private prisma: PrismaService) {}

  async create(createFooterContentDto: CreateFooterContentDto) {
    // If this is set to active, deactivate all others
    if (createFooterContentDto.isActive !== false) {
      await this.prisma.footerContent.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.footerContent.create({
      data: {
        ...createFooterContentDto,
        quickLinks: createFooterContentDto.quickLinks as any,
        infoLinks: createFooterContentDto.infoLinks as any,
        phones: createFooterContentDto.phones as any,
      },
    });
  }

  async findAll() {
    return this.prisma.footerContent.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActive() {
    const content = await this.prisma.footerContent.findFirst({
      where: { isActive: true },
    });

    if (!content) {
      // Return default content if none is active
      return {
        logo: '/logos/loho.png',
        logoAlt: 'فیدار تجارت سوبا',
        companyName: 'فیدار تجارت سوبا',
        description: 'نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده با بهترین کیفیت و خدمات',
        quickLinks: [
          { href: '/', label: 'خانه' },
          { href: '/cars', label: 'خودروها' },
          { href: '/blog', label: 'مقالات' },
          { href: '/news', label: 'اخبار' },
        ],
        infoLinks: [
          { href: '/about', label: 'درباره ما' },
          { href: '/contact', label: 'تماس با ما' },
        ],
        address: 'تهران-بلوار آیت الله کاشانی-خیابان حسن آباد-کوچه اول الف-پلاک ۲ ساختمان مهرگان-طبقه دوم واحد۴',
        phone: '021-12345678',
        phones: ['02144026696', '02144979483'],
        email: 'info@ftsmotors.com',
        copyrightText: `© ${new Date().getFullYear()} فیدار تجارت سوبا. تمامی حقوق محفوظ است.`,
        isActive: true,
      };
    }

    return content;
  }

  async findOne(id: string) {
    const content = await this.prisma.footerContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Footer content not found');
    }

    return content;
  }

  async update(id: string, updateFooterContentDto: UpdateFooterContentDto) {
    await this.findOne(id);

    // If this is set to active, deactivate all others
    if (updateFooterContentDto.isActive === true) {
      await this.prisma.footerContent.updateMany({
        where: { isActive: true, id: { not: id } },
        data: { isActive: false },
      });
    }

    const updateData: any = { ...updateFooterContentDto };
    if (updateFooterContentDto.quickLinks) {
      updateData.quickLinks = updateFooterContentDto.quickLinks as any;
    }
    if (updateFooterContentDto.infoLinks) {
      updateData.infoLinks = updateFooterContentDto.infoLinks as any;
    }
    if (updateFooterContentDto.phones) {
      updateData.phones = updateFooterContentDto.phones as any;
    }

    return this.prisma.footerContent.update({
      where: { id },
      data: updateData,
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    // Deactivate all others
    await this.prisma.footerContent.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate this one
    return this.prisma.footerContent.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.footerContent.delete({
      where: { id },
    });
  }
}

