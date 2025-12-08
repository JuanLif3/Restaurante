import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource, // Usamos DataSource para Transacciones (Seguridad de datos)
  ) {}

  async create (createOrderDto: CreateOrderDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { tableNumber, items } = createOrderDto;
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // Procesar cada producto pedido
      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });

        if(!product) {
          throw new NotFoundException(`Producto ${item.productId} no encontrado`);
        }

        if(product.stock < item.quantity) {
          throw new BadRequestException(`No hay suficiente stock de ${product.name}. Quedan ${product.stock}`);
        }

        // Descontar stock (REQUISITO BODEGA)
        product.stock -= item.quantity;
        await queryRunner.manager.save(product)

        // Crear el item del pedido
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        orderItem.priceAtPurchase = product.price;

        // Sumar el total
        totalAmount += product.price * item.quantity;
        orderItems.push(orderItem);

        // Crear la cabecera del pedido
        const order = new Order();
        order.tableNumber = tableNumber;
        order.user = user;
        order.total = totalAmount;
        order.status = 'pending';
        order.items = orderItems;

        const savedOrder = await queryRunner.manager.save(Order, order);

        // Confirmar transacción (Guardar todo si no hubo errores)
        await queryRunner.commitTransaction();
        return savedOrder;
      }
    } catch (error) {
      // Si algo falla aca, revertir todo (devolver stock, no crear pedido)
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.orderRepository.find({
      relations: ['items', 'items.product'], // Traer los platos y sus nombres
      order: { createdAt: 'DESC' } // Los más recientes primero
    });
  }

  // Para que Cocina filtre solo lo pendiente
  findAllPending() {
    return this.orderRepository.find({
      where: { status: 'pending' },
      relations: ['items', 'items.product'],
      order: { createdAt: 'ASC' } // El más antiguo primero (FIFO)
    });
  }

  findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user']
    });
  }

  // Para actualizar estado (Ej: Cocina marca como 'ready')
  async updateStatus(id: string, status: string) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException('Pedido no encontrado');
    
    order.status = status;
    return this.orderRepository.save(order);
  }
}