import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { Finance } from './entities/finance.entity';
import { Order } from '../orders/entities/order.entity'; // Importamos Pedidos para sumar ventas

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(Finance)
    private financeRepository: Repository<Finance>,
    private dataSource: DataSource,
  ) {}

  // Registrar un gasto o ingreso extra manual
  create(createFinanceDto: CreateFinanceDto) {
    const movement = this.financeRepository.create(createFinanceDto);
    return this.financeRepository.save(movement);
  }

  findAll() {
    return this.financeRepository.find({ order: { createdAt: 'DESC' } });
  }

  // ¡REPORTE FINANCIERO INTELIGENTE!
  async getSummary() {
    // 1. Sumar todas las ventas (Pedidos que no estén 'cancelled')
    const ordersResult = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('order')
      .where("order.status != :status", { status: 'cancelled' })
      .select("SUM(order.total)", "totalSales")
      .getRawOne();
    
    const totalSales = parseInt(ordersResult.totalSales || '0');

    // 2. Sumar gastos manuales (Egresos)
    const expensesResult = await this.financeRepository
      .createQueryBuilder('finance')
      .where("finance.type = :type", { type: 'egreso' })
      .select("SUM(finance.amount)", "totalExpenses")
      .getRawOne();

    const totalExpenses = parseInt(expensesResult.totalExpenses || '0');

    // 3. Sumar ingresos manuales extras (si los hubiera)
    const extraIncomeResult = await this.financeRepository
      .createQueryBuilder('finance')
      .where("finance.type = :type", { type: 'ingreso' })
      .select("SUM(finance.amount)", "totalExtra")
      .getRawOne();

    const totalExtra = parseInt(extraIncomeResult.totalExtra || '0');

    return {
      totalSales,     // Dinero por comida vendida
      totalExpenses,  // Dinero gastado en insumos/sueldos
      totalExtra,     // Otros ingresos
      balance: (totalSales + totalExtra) - totalExpenses // Ganancia Real
    };
  }
}