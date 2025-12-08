import { PrimaryGeneratedColumn, Entity, Column, CreateDateColumn } from "typeorm";

@Entity('finances')
export class Finance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    type: string; // 'ingreso' (extra) o 'egreso' (gasto)

    @Column('int')
    amount: number;

    @Column('text')
    description: string;

    @CreateDateColumn()
    createdAt: Date;
}
