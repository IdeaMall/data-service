import { OrderModel } from '@ideamall/data-model';
import { Column, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { Goods } from './Goods';
import { User, UserBase } from './User';

export class Order extends UserBase implements OrderModel {
    @ManyToMany(() => Goods)
    @JoinTable()
    goods: Goods;

    @Column()
    price: number;

    @Column({ nullable: true })
    remark?: string;

    @Column('date')
    confirmedAt: Date;

    @ManyToOne(() => User)
    confirmedBy: User;
}
