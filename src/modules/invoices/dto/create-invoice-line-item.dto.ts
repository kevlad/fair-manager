import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, MaxLength, IsDateString } from 'class-validator';

export class CreateInvoiceLineItemDto {
  @ApiProperty({ example: 'Business Suite AI - Pro Plan (Monthly: Jan 2025)', description: 'Line item description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 1, description: 'Quantity' })
  @IsNumber()
  @Min(0.01) // Or 1 if only whole units
  quantity: number;

  @ApiProperty({ example: 99.9900, description: 'Unit price (up to 4 decimal places)' })
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ example: 19.00, description: 'Tax rate percentage for this line item (e.g., 19.00 for 19%)', default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxRatePercentage?: number = 0;

  @ApiPropertyOptional({ example: 'BSA_PRO_MTH', description: 'Internal product or plan code' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  productCode?: string;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Service period start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  servicePeriodStart?: string; // Use string for DTO, convert to Date in service

  @ApiPropertyOptional({ example: '2025-01-31', description: 'Service period end date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  servicePeriodEnd?: string;
}
