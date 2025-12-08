import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    quantity: number;

    @Column('int')
    priceAtPurchase: number; // Guardamos el precio al momento de la compra (por si sube despues)

    // Relación con el Pedido Padre
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    // Relación con el Producto
    @ManyToOne(() => Product, { eager: true }) // eager: true trae los datos del producto automáticamente
    product: Product;
}