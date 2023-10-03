import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseFilter, ListChunk } from './Base';
import { Goods } from './Goods';
import { UserBase, UserInputData } from './User';
import { FavoriteType } from './constant';

@Entity()
export class Favorite extends UserBase {
    @IsEnum(FavoriteType)
    @Column({ enum: FavoriteType })
    type: FavoriteType;

    @Type(() => Goods)
    @ValidateNested()
    @ManyToMany(() => Goods)
    @JoinTable()
    goods: Goods;
}

export class FavoriteFilter
    extends BaseFilter
    implements Partial<UserInputData<Favorite>>
{
    @IsEnum(FavoriteType)
    @IsOptional()
    type?: FavoriteType;
}

export class FavoriteListChunk implements ListChunk<Favorite> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Favorite)
    @ValidateNested({ each: true })
    list: Favorite[];
}
