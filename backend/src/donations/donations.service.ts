import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DonationsService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async create(createDonationDto: CreateDonationDto) {
    const donation = await this.prisma.donation.create({
      data: {
        ...createDonationDto,
        amount: createDonationDto.amount.toString(),
      },
    });

    // Fire-and-forget — email failure never blocks the response
    this.mail.sendDonationThankYou({
      donorName:  donation.donorName,
      donorEmail: donation.donorEmail,
      amount:     Number(donation.amount),
      currency:   donation.currency,
      donationId: donation.id,
      message:    donation.message ?? undefined,
    });

    return donation;
  }

  async findAll() {
    return this.prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const donation = await this.prisma.donation.findUnique({ where: { id } });
    if (!donation) throw new NotFoundException(`Donation #${id} not found`);
    return donation;
  }

  async updateStatus(id: number, status: any) {
    await this.findOne(id);
    return this.prisma.donation.update({ where: { id }, data: { status } });
  }

  /** Aggregated stats for the admin overview */
  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalDonations,
      monthlyTotal,
      mediaCount,
      recentDonations,
    ] = await Promise.all([
      this.prisma.donation.count(),
      this.prisma.donation.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.image.count({ where: { isActive: true } }),
      this.prisma.donation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          donorName: true,
          donorEmail: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalDonations,
      monthlyTotal: Number(monthlyTotal._sum.amount ?? 0),
      mediaCount,
      recentDonations,
    };
  }
}
