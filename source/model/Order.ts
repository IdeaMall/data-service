import { Type } from 'class-transformer';
import {
    IsDate,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from 'class-validator';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from 'typeorm';

import { Address } from './Address';
import { BaseFilter, ListChunk } from './Base';
import { GoodsItem } from './GoodsItem';
import { Parcel } from './Parcel';
import { User, UserBase, UserInputData } from './User';

@Entity()
export class Order extends UserBase {
    @Type(() => GoodsItem)
    @ValidateNested({ each: true })
    @ManyToMany(() => GoodsItem)
    @JoinTable()
    items: GoodsItem[];

    @IsInt({ each: true })
    @Min(1)
    @Column('simple-json')
    itemCounts: number[];

    @IsNumber()
    @Column()
    price: number;

    @Type(() => Address)
    @ValidateNested()
    @ManyToOne(() => Address)
    address: Address;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    remark?: string;

    @IsString()
    @Column()
    payMethod: string;

    @IsString()
    @Column()
    payCode: string;

    @Type(() => Parcel)
    @ValidateNested({ each: true })
    @IsOptional()
    @OneToMany(() => Parcel, ({ order }) => order, { nullable: true })
    parcels?: Parcel[];

    @IsDate()
    @IsOptional()
    @Column('date')
    confirmedAt?: Date;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    confirmedBy?: User;
}

export class OrderFilter
    extends BaseFilter
    implements Partial<UserInputData<Order>>
{
    @IsString()
    @IsOptional()
    remark?: string;

    @IsString()
    @IsOptional()
    payMethod?: string;
}

export class OrderListChunk implements ListChunk<Order> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Order)
    @ValidateNested({ each: true })
    list: Order[];
}
