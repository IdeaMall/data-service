import { Type } from 'class-transformer';
import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseFilter, ListChunk } from './Base';
import { Goods } from './Goods';
import { UserBase, UserInputData } from './User';

@Entity()
export class Comment extends UserBase {
    @Type(() => Goods)
    @ValidateNested()
    @ManyToMany(() => Goods)
    @JoinTable()
    goods: Goods;

    @IsNumber()
    @Column()
    score: number;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    content?: string;
}

export class CommentFilter
    extends BaseFilter
    implements Partial<UserInputData<Comment>>
{
    @IsInt()
    @Min(1)
    @IsOptional()
    goods?: number;

    @IsNumber()
    @IsOptional()
    score?: number;

    @IsString()
    @IsOptional()
    content?: string;
}

export class CommentListChunk implements ListChunk<Comment> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Comment)
    @ValidateNested({ each: true })
    list: Comment[];
}
