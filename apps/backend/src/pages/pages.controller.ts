import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get all published pages (Public)' })
  @ApiResponse({ status: 200, description: 'List of published pages' })
  async findAllPublic() {
    return this.pagesService.findAll(true);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a published page by slug (Public)' })
  @ApiResponse({ status: 200, description: 'Page details' })
  async findOnePublic(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new page (Admin only)' })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  async create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pages (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of pages' })
  async findAll(@Query('published') published?: string) {
    const isPublished = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.pagesService.findAll(isPublished);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a page by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Page details' })
  async findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a page (Admin only)' })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  async update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a page (Admin only)' })
  @ApiResponse({ status: 200, description: 'Page deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}

