import { GoodsItemOutput } from '@ideamall/data-model';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Goods } from './Goods';
import { UserBase } from './User';

@Entity()
export class GoodsItem extends UserBase implements GoodsItemOutput {
    @ManyToOne(() => Goods)
    goods: Goods;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    price: number;

    @Column()
    kilogram: number;

    @Column({ nullable: true })
    code?: string;

    @Column({ type: 'simple-array', nullable: true })
    styles?: string[];

    @Column()
    stock: number;
}
