import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /** POST /images/upload — multipart file upload (admin only) */
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/i;
        if (!allowed.test(extname(file.originalname))) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, // Use any for FormData to avoid validation issues
  ) {
    if (!file) throw new BadRequestException('No file provided');
    const url = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${file.filename}`;
    
    const data: any = {
      url,
      title: body.title,
      description: body.description,
      category: body.category,
      isActive: body.isActive !== undefined ? body.isActive === 'true' || body.isActive === true : true,
    };
    
    return this.imagesService.create(data);
  }

  /** POST /images — create by URL (admin only) */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createImageDto: CreateImageDto) {
    if (!createImageDto.url) throw new BadRequestException('url is required');
    return this.imagesService.create(createImageDto);
  }

  /** GET /images?category= — public */
  @Get()
  findAll(@Query('category') category?: string) {
    return this.imagesService.findAll(category);
  }

  /** GET /images/all — admin sees all including inactive */
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdmin() {
    return this.imagesService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imagesService.update(id, updateImageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.remove(id);
  }
}
