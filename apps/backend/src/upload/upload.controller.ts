import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class UploadController {
  private readonly logger = new Logger(UploadController.name);
  @Get('images')
  @ApiOperation({ summary: 'Get list of uploaded images (Admin only)' })
  async getImages() {
    try {
      const imagesPath = join(process.cwd(), 'uploads', 'images');
      if (!existsSync(imagesPath)) {
        // Create directory if it doesn't exist
        mkdirSync(imagesPath, { recursive: true });
        return [];
      }

      const files = readdirSync(imagesPath)
        .filter((file) => {
          const ext = extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
        .map((file) => {
          try {
            const filePath = join(imagesPath, file);
            const stats = statSync(filePath);
            return {
              url: `/uploads/images/${file}`,
              filename: file,
              size: stats.size,
              createdAt: stats.birthtime,
            };
          } catch (fileError) {
            this.logger.warn(`Error reading file ${file}: ${fileError.message}`);
            return null;
          }
        })
        .filter((file) => file !== null)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return files;
    } catch (error) {
      this.logger.error(`Error getting images: ${error.message}`, error.stack);
      throw new InternalServerErrorException('خطا در دریافت لیست تصاویر');
    }
  }

  @Get('files')
  @ApiOperation({ summary: 'Get list of uploaded files (Admin only)' })
  async getFiles() {
    try {
      const filesPath = join(process.cwd(), 'uploads', 'files');
      if (!existsSync(filesPath)) {
        // Create directory if it doesn't exist
        mkdirSync(filesPath, { recursive: true });
        return [];
      }

      const files = readdirSync(filesPath)
        .map((file) => {
          try {
            const filePath = join(filesPath, file);
            const stats = statSync(filePath);
            return {
              url: `/uploads/files/${file}`,
              filename: file,
              size: stats.size,
              createdAt: stats.birthtime,
            };
          } catch (fileError) {
            this.logger.warn(`Error reading file ${file}: ${fileError.message}`);
            return null;
          }
        })
        .filter((file) => file !== null)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return files;
    } catch (error) {
      this.logger.error(`Error getting files: ${error.message}`, error.stack);
      throw new InternalServerErrorException('خطا در دریافت لیست فایل‌ها');
    }
  }

  @Post('image')
  @ApiOperation({ summary: 'Upload image file (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'images');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('فقط فایل‌های تصویری مجاز هستند'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        this.logger.warn('Upload attempt without file');
        throw new BadRequestException('فایل ارسال نشده است');
      }

      this.logger.log(`Image uploaded: ${file.filename} (${file.size} bytes)`);

      return {
        url: `/uploads/images/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error uploading image: ${error.message}`, error.stack);
      throw new InternalServerErrorException('خطا در آپلود تصویر');
    }
  }

  @Post('file')
  @ApiOperation({ summary: 'Upload any file (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'files');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        this.logger.warn('Upload attempt without file');
        throw new BadRequestException('فایل ارسال نشده است');
      }

      this.logger.log(`File uploaded: ${file.filename} (${file.size} bytes)`);

      return {
        url: `/uploads/files/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error uploading file: ${error.message}`, error.stack);
      throw new InternalServerErrorException('خطا در آپلود فایل');
    }
  }
}
