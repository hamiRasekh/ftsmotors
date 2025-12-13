import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(published?: boolean, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = published !== undefined ? { published } : {};

    const [data, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.news.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async findBySlug(slug: string) {
    const news = await this.prisma.news.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async create(createNewsDto: CreateNewsDto, authorId: string) {
    return this.prisma.news.create({
      data: {
        ...createNewsDto,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    await this.findOne(id);
    return this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.news.delete({
      where: { id },
    });
  }
}

