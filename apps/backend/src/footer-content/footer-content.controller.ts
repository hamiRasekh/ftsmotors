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
import { FooterContentService } from './footer-content.service';
import { CreateFooterContentDto } from './dto/create-footer-content.dto';
import { UpdateFooterContentDto } from './dto/update-footer-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('footer-content')
@Controller('footer-content')
export class FooterContentController {
  constructor(private readonly footerContentService: FooterContentService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get active footer content (public)' })
  @ApiResponse({ status: 200, description: 'Active footer content' })
  async getActive() {
    return this.footerContentService.getActive();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all footer content (admin)' })
  @ApiResponse({ status: 200, description: 'List of footer content' })
  async findAll() {
    return this.footerContentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get footer content by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Footer content details' })
  async findOne(@Param('id') id: string) {
    return this.footerContentService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new footer content (admin)' })
  @ApiResponse({ status: 201, description: 'Footer content created successfully' })
  async create(@Body() createFooterContentDto: CreateFooterContentDto) {
    return this.footerContentService.create(createFooterContentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update footer content (admin)' })
  @ApiResponse({ status: 200, description: 'Footer content updated successfully' })
  async update(@Param('id') id: string, @Body() updateFooterContentDto: UpdateFooterContentDto) {
    return this.footerContentService.update(id, updateFooterContentDto);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate footer content (admin)' })
  @ApiResponse({ status: 200, description: 'Footer content activated successfully' })
  async activate(@Param('id') id: string) {
    return this.footerContentService.activate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete footer content (admin)' })
  @ApiResponse({ status: 200, description: 'Footer content deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.footerContentService.remove(id);
  }
}

