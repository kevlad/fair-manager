import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class StripeWebhookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  data: any;
}
