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
      this.logger.debug(`Looking for images in: ${imagesPath}`);
      this.logger.debug(`Current working directory: ${process.cwd()}`);

      if (!existsSync(imagesPath)) {
        this.logger.log(`Images directory does not exist, creating: ${imagesPath}`);
        try {
          mkdirSync(imagesPath, { recursive: true });
          this.logger.log(`Images directory created successfully`);
        } catch (mkdirError) {
          this.logger.error(`Failed to create images directory: ${mkdirError.message}`, mkdirError.stack);
          throw new InternalServerErrorException(`خطا در ایجاد پوشه تصاویر: ${mkdirError.message}`);
        }
        return [];
      }

      let files: string[];
      try {
        files = readdirSync(imagesPath);
        this.logger.debug(`Found ${files.length} files in images directory`);
      } catch (readError) {
        this.logger.error(`Failed to read images directory: ${readError.message}`, readError.stack);
        throw new InternalServerErrorException(`خطا در خواندن پوشه تصاویر: ${readError.message}`);
      }

      const imageFiles = files
        .filter((file) => {
          const ext = extname(file).toLowerCase();
          const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
          if (!isImage) {
            this.logger.debug(`Skipping non-image file: ${file}`);
          }
          return isImage;
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

      this.logger.log(`Returning ${imageFiles.length} image files`);
      return imageFiles;
    } catch (error) {
      this.logger.error(`Error getting images: ${error.message}`, error.stack);
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(`خطا در دریافت لیست تصاویر: ${error.message}`);
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
          try {
            const uploadPath = join(process.cwd(), 'uploads', 'images');
            this.logger.debug(`Upload destination: ${uploadPath}`);
            if (!existsSync(uploadPath)) {
              this.logger.log(`Creating upload directory: ${uploadPath}`);
              mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          } catch (error) {
            this.logger.error(`Error setting upload destination: ${error.message}`, error.stack);
            cb(error, null);
          }
        },
        filename: (req, file, cb) => {
          try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            this.logger.debug(`Generated filename: ${filename}`);
            cb(null, filename);
          } catch (error) {
            this.logger.error(`Error generating filename: ${error.message}`, error.stack);
            cb(error, null);
          }
        },
      }),
      fileFilter: (req, file, cb) => {
        try {
          const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          this.logger.debug(`File MIME type: ${file.mimetype}`);
          if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            this.logger.warn(`Invalid file type: ${file.mimetype}`);
            cb(new BadRequestException('فقط فایل‌های تصویری مجاز هستند'), false);
          }
        } catch (error) {
          this.logger.error(`Error in file filter: ${error.message}`, error.stack);
          cb(error, false);
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

      this.logger.log(`Image uploaded successfully: ${file.filename} (${file.size} bytes, ${file.mimetype})`);

      const response = {
        url: `/uploads/images/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };

      this.logger.debug(`Upload response: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error uploading image: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`خطا در آپلود تصویر: ${error.message}`);
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
