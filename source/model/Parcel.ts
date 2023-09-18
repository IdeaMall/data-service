import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { GoodsItem } from './GoodsItem';
import { Order } from './Order';
import { UserBase } from './User';

@Entity()
export class Parcel extends UserBase {
    @Type(() => Order)
    @ManyToOne(() => Order)
    order: Order;

    @Type(() => GoodsItem)
    @ValidateNested({ each: true })
    @ManyToMany(() => GoodsItem)
    @JoinTable()
    items: GoodsItem[];

    @IsString()
    @Column()
    postCompany: string;

    @IsString()
    @Column()
    trackCode: string;
}
