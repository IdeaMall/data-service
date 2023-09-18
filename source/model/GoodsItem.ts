import { Type } from 'class-transformer';
import {
    IsEAN,
    IsInt,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseFilter, ListChunk } from './Base';
import { Goods } from './Goods';
import { UserBase, UserInputData } from './User';

@Entity()
export class GoodsItem extends UserBase {
    @Type(() => Goods)
    @ManyToOne(() => Goods)
    goods: Goods;

    @IsString()
    @Column()
    name: string;

    @IsUrl()
    @Column()
    image: string;

    @IsNumber()
    @Column()
    price: number;

    @IsNumber()
    @Min(0)
    @Column()
    kilogram: number;

    @IsEAN()
    @IsOptional()
    @Column({ nullable: true })
    code?: string;

    @IsObject()
    @IsOptional()
    @Column({ type: 'simple-json', nullable: true })
    styles?: Record<string, string>;

    @IsInt()
    @Min(0)
    @Column()
    stock: number;
}

export class GoodsItemFilter
    extends BaseFilter
    implements Partial<UserInputData<GoodsItem>>
{
    @IsString()
    @IsOptional()
    name?: string;

    @IsEAN()
    @IsOptional()
    code?: string;
}

export class GoodsItemListChunk implements ListChunk<GoodsItem> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => GoodsItem)
    @ValidateNested({ each: true })
    list: GoodsItem[];
}
