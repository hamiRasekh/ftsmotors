import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FeedbackType } from '@prisma/client';

@ApiTags('feedbacks')
@Controller('feedbacks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  async create(@Body() createFeedbackDto: CreateFeedbackDto, @Request() req) {
    return this.feedbacksService.create(req.user.userId, createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiResponse({ status: 200, description: 'List of feedbacks' })
  async findAll(@Request() req, @Query('type') type?: FeedbackType) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
    return this.feedbacksService.findAll(type, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feedback by ID' })
  @ApiResponse({ status: 200, description: 'Feedback details' })
  async findOne(@Param('id') id: string) {
    return this.feedbacksService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a feedback (Admin only)' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }
}

