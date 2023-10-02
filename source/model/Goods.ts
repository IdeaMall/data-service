import { Type } from 'class-transformer';
import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Address } from './Address';
import { BaseFilter, ListChunk } from './Base';
import { Category } from './Category';
import { GoodsItem } from './GoodsItem';
import { UserBase, UserInputData } from './User';

export class GoodsStyle {
    @IsString()
    name: string;

    @IsString({ each: true })
    values: string[];
}

@Entity()
export class Goods extends UserBase implements Goods {
    @IsString()
    @Column({ unique: true })
    name: string;

    @IsString()
    @Column()
    description: string;

    @Type(() => Category)
    @ValidateNested()
    @ManyToOne(() => Category)
    category: Category;

    @Type(() => GoodsStyle)
    @ValidateNested({ each: true })
    @IsOptional()
    @Column({ type: 'simple-json', nullable: true })
    styles?: GoodsStyle[];

    @Type(() => GoodsItem)
    @ValidateNested()
    @IsOptional()
    @OneToMany(() => GoodsItem, ({ goods }) => goods)
    items?: GoodsItem[];

    @Type(() => Address)
    @ValidateNested()
    @ManyToOne(() => Address)
    store: Address;
}

export class GoodsFilter
    extends BaseFilter
    implements Partial<UserInputData<Goods>>
{
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    category?: number;

    @IsNumber()
    @Min(1)
    @IsOptional()
    store?: number;
}

export class GoodsListChunk implements ListChunk<Goods> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Goods)
    @ValidateNested({ each: true })
    list: Goods[];
}
