import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('finances')
@UseGuards(AuthGuard('jwt')) // Solo personal autorizado
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto) {
    return this.financesService.create(createFinanceDto);
  }

  @Get()
  findAll() {
    return this.financesService.findAll();
  }

  @Get('summary') // Endpoint para ver el balance final
  getSummary() {
    return this.financesService.getSummary();
  }
}