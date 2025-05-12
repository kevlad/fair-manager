import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsNotEmpty, IsOptional } from 'class-validator';

export class PaypalWebhookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event_type: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  resource: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  summary?: string;
}
