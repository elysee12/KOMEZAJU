import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('all')
  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('stats')
  async getStats() {
    const total = await this.prisma.contactMessage.count();
    const unread = await this.prisma.contactMessage.count({
      where: { isRead: false },
    });
    const recent = await this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return { total, unread, recent };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  @Patch(':id/unread')
  async markAsUnread(@Param('id', ParseIntPipe) id: number) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: false },
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.prisma.contactMessage.delete({ where: { id } });
    return { success: true };
  }
}
