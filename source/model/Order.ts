import { OrderOutput } from '@ideamall/data-model';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from 'typeorm';

import { Address } from './Address';
import { GoodsItem } from './GoodsItem';
import { Parcel } from './Parcel';
import { User, UserBase } from './User';

@Entity()
export class Order extends UserBase implements OrderOutput {
    @ManyToMany(() => GoodsItem)
    @JoinTable()
    items: GoodsItem[];

    @Column('simple-json')
    itemCounts: number[];

    @Column()
    price: number;

    @ManyToOne(() => Address)
    address: Address;

    @Column({ nullable: true })
    remark?: string;

    @Column()
    payMethod: string;

    @Column()
    payCode: string;

    @OneToMany(() => Parcel, ({ order }) => order, { nullable: true })
    parcels?: Parcel[];

    @Column('date')
    confirmedAt: Date;

    @ManyToOne(() => User)
    confirmedBy: User;
}
