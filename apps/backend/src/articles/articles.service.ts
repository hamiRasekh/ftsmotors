import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(published?: boolean, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = published !== undefined ? { published } : {};

    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
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
      this.prisma.article.count({ where }),
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
    const article = await this.prisma.article.findUnique({
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
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
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
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(createArticleDto: CreateArticleDto, authorId: string) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
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

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    await this.findOne(id);
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
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
    return this.prisma.article.delete({
      where: { id },
    });
  }
}

