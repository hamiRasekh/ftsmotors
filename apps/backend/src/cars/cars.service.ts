import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string, published?: boolean, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (published !== undefined) {
      where.published = published;
    }

    const [data, total] = await Promise.all([
      this.prisma.car.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.car.count({ where }),
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
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  async findBySlug(slug: string) {
    const car = await this.prisma.car.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  async create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({
      data: createCarDto,
      include: {
        category: true,
      },
    });
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    await this.findOne(id);
    return this.prisma.car.update({
      where: { id },
      data: updateCarDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.car.delete({
      where: { id },
    });
  }
}

