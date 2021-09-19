import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ConnectionArgs {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  first?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  last?: number;

  // Memo: id
  @ApiProperty({ required: false })
  after?: string;

  // Memo: id
  @ApiProperty({ required: false })
  before?: string;
}
