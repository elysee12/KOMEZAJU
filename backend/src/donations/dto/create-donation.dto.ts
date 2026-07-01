import { IsString, IsEmail, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { DonationStatus } from '@prisma/client';

export class CreateDonationDto {
  @IsString()
  donorName: string;

  @IsEmail()
  donorEmail: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
