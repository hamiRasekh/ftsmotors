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
import { HeaderContentService } from './header-content.service';
import { CreateHeaderContentDto } from './dto/create-header-content.dto';
import { UpdateHeaderContentDto } from './dto/update-header-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('header-content')
@Controller('header-content')
export class HeaderContentController {
  constructor(private readonly headerContentService: HeaderContentService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get active header content (public)' })
  @ApiResponse({ status: 200, description: 'Active header content' })
  async getActive() {
    return this.headerContentService.getActive();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all header content (admin)' })
  @ApiResponse({ status: 200, description: 'List of header content' })
  async findAll() {
    return this.headerContentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get header content by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Header content details' })
  async findOne(@Param('id') id: string) {
    return this.headerContentService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new header content (admin)' })
  @ApiResponse({ status: 201, description: 'Header content created successfully' })
  async create(@Body() createHeaderContentDto: CreateHeaderContentDto) {
    return this.headerContentService.create(createHeaderContentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update header content (admin)' })
  @ApiResponse({ status: 200, description: 'Header content updated successfully' })
  async update(@Param('id') id: string, @Body() updateHeaderContentDto: UpdateHeaderContentDto) {
    return this.headerContentService.update(id, updateHeaderContentDto);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate header content (admin)' })
  @ApiResponse({ status: 200, description: 'Header content activated successfully' })
  async activate(@Param('id') id: string) {
    return this.headerContentService.activate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete header content (admin)' })
  @ApiResponse({ status: 200, description: 'Header content deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.headerContentService.remove(id);
  }
}

