import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity } from 'typeorm';

import { BaseFilter, ListChunk } from './Base';
import { UserBase, UserInputData } from './User';

@Entity()
export class Category extends UserBase {
    @IsString()
    @Column({ unique: true })
    name: string;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    image?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    @Column({ nullable: true })
    parentId?: number;
}

export class CategoryFilter
    extends BaseFilter
    implements Partial<UserInputData<Category>>
{
    @IsInt()
    @Min(1)
    @IsOptional()
    parentId?: number;
}

export class CategoryListChunk implements ListChunk<Category> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Category)
    @ValidateNested({ each: true })
    list: Category[];
}
