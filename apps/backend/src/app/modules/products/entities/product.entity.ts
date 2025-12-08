import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('int')
    price: number;

    @Column('int', { default: 0 })
    stock: number; // Clave para el rol de bodega

    @Column('text')
    category: string; // Entrada , fondo, bebida o postre

    @Column('text', { nullable: true })
    description: string;

    @Column('boolean', { default: true })
    isActive: boolean; // Para borrar sin perder el historial

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
