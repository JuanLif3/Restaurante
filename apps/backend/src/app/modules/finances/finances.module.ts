import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { Finance } from './entities/finance.entity';
import { Order } from '../orders/entities/order.entity'; // Necesario para el reporte

@Module({
  imports: [TypeOrmModule.forFeature([Finance, Order])],
  controllers: [FinancesController],
  providers: [FinancesService],
})
export class FinancesModule {}