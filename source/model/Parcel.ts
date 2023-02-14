import { ParcelOutput } from '@ideamall/data-model';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { GoodsItem } from './GoodsItem';
import { Order } from './Order';
import { UserBase } from './User';

@Entity()
export class Parcel extends UserBase implements ParcelOutput {
    @ManyToOne(() => Order)
    order: Order;

    @ManyToMany(() => GoodsItem)
    @JoinTable()
    items: GoodsItem[];

    @Column()
    postCompany: string;

    @Column()
    trackCode: string;
}
