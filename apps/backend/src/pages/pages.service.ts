import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto) {
    const existingPage = await this.prisma.page.findUnique({
      where: { slug: createPageDto.slug },
    });

    if (existingPage) {
      throw new ConflictException('Page with this slug already exists');
    }

    return this.prisma.page.create({
      data: createPageDto,
    });
  }

  async findAll(published?: boolean) {
    const where: any = {};
    if (published !== undefined) {
      where.isPublished = published;
    }

    return this.prisma.page.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
    });

    if (!page || !page.isPublished) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    await this.findOne(id);

    if (updatePageDto.slug) {
      const existingPage = await this.prisma.page.findUnique({
        where: { slug: updatePageDto.slug },
      });

      if (existingPage && existingPage.id !== id) {
        throw new ConflictException('Page with this slug already exists');
      }
    }

    return this.prisma.page.update({
      where: { id },
      data: updatePageDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.page.delete({
      where: { id },
    });
  }
}

