import { Controller, Get, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';
import { PrismaService } from './prisma/prisma.service';

class ContactDto {
  @IsString() @MinLength(2) name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(5) message: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mail: MailService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('contact')
  async contact(@Body() body: ContactDto) {
    if (!body.name || !body.email || !body.message) {
      throw new BadRequestException('name, email and message are required');
    }
    try {
      // Save message to database
      await this.prisma.contactMessage.create({
        data: {
          name: body.name.trim(),
          email: body.email.trim(),
          message: body.message.trim(),
        },
      });
      
      // Send email notification
      await this.mail.sendContactEmail({
        name:    body.name.trim(),
        email:   body.email.trim(),
        message: body.message.trim(),
      });
      
      return { success: true, message: 'Your message has been sent.' };
    } catch (err) {
      // Even if email fails, the message is saved
      throw new InternalServerErrorException('Failed to send message. Please try again later.');
    }
  }
}
