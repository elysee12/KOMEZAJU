import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto) {
    return this.prisma.image.create({
      data: createImageDto,
    });
  }

  async findAll(category?: string) {
    return this.prisma.image.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.image.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    await this.findOne(id);
    return this.prisma.image.update({
      where: { id },
      data: updateImageDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.image.delete({
      where: { id },
    });
  }
}
