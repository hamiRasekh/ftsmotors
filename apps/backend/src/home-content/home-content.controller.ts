import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HomeContentService } from './home-content.service';
import { CreateHomeContentDto } from './dto/create-home-content.dto';
import { UpdateHomeContentDto } from './dto/update-home-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('home-content')
@Controller('home-content')
export class HomeContentController {
  constructor(private readonly homeContentService: HomeContentService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get active home content (public)' })
  @ApiResponse({ status: 200, description: 'Active home content' })
  async getActive() {
    return this.homeContentService.getActive();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all home content (admin)' })
  @ApiResponse({ status: 200, description: 'List of home content' })
  async findAll() {
    return this.homeContentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get home content by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Home content details' })
  async findOne(@Param('id') id: string) {
    return this.homeContentService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new home content (admin)' })
  @ApiResponse({ status: 201, description: 'Home content created successfully' })
  async create(@Body() createHomeContentDto: CreateHomeContentDto) {
    return this.homeContentService.create(createHomeContentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update home content (admin)' })
  @ApiResponse({ status: 200, description: 'Home content updated successfully' })
  async update(@Param('id') id: string, @Body() updateHomeContentDto: UpdateHomeContentDto) {
    return this.homeContentService.update(id, updateHomeContentDto);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate home content (admin)' })
  @ApiResponse({ status: 200, description: 'Home content activated successfully' })
  async activate(@Param('id') id: string) {
    return this.homeContentService.activate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete home content (admin)' })
  @ApiResponse({ status: 200, description: 'Home content deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.homeContentService.remove(id);
  }
}

