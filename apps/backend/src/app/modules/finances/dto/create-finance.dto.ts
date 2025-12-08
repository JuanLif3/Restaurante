import { IsNotEmpty, IsInt, IsString, IsIn, Min } from 'class-validator';

export class CreateFinanceDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['ingreso', 'egreso'])
  type: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}