import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  private readonly logger = new Logger(CarsController.name);

  constructor(private readonly carsService: CarsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all cars with pagination' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('published') published?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      this.logger.log(`GET /cars - categoryId: ${categoryId}, published: ${published}, page: ${page}, limit: ${limit}`);
      
      const result = await this.carsService.findAll(
        categoryId,
        published === 'true' ? true : published === 'false' ? false : undefined,
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 10,
      );
      
      this.logger.log(`GET /cars - Success: ${result.data.length} cars returned`);
      return result;
    } catch (error: any) {
      this.logger.error(`GET /cars - Error: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get car by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.carsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create car (Admin only)' })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update car (Admin only)' })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car (Admin only)' })
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}

