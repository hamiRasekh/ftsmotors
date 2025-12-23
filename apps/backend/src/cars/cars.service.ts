import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  private readonly logger = new Logger(CarsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string, published?: boolean, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};
      
      if (categoryId) {
        where.categoryId = categoryId;
      }
      
      if (published !== undefined) {
        where.published = published;
      }

      this.logger.log(`Finding cars with filters: categoryId=${categoryId}, published=${published}, page=${page}, limit=${limit}`);

      // First check if there are any cars matching the criteria
      const total = await this.prisma.car.count({ where });
      
      if (total === 0) {
        this.logger.log('No cars found matching criteria');
        return {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }

      // Fetch cars with category
      const data = await this.prisma.car.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              image: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      this.logger.log(`Found ${data.length} cars out of ${total} total`);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      this.logger.error(`Error in findAll: ${error.message}`, error.stack);
      
      // Handle Prisma errors
      if (error.code === 'P2002') {
        throw new InternalServerErrorException('Database constraint violation');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Resource not found');
      }
      
      throw new InternalServerErrorException(`Failed to fetch cars: ${error.message}`);
    }
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

