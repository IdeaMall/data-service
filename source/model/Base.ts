import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NewData } from 'mobx-restful';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

export abstract class Base {
    constructor(id?: number) {
        if (id) this.id = id;
    }

    @IsInt()
    @IsOptional()
    @PrimaryGeneratedColumn()
    id: number;

    @IsDate()
    @IsOptional()
    @CreateDateColumn()
    createdAt: Date;

    @IsDate()
    @IsOptional()
    @UpdateDateColumn()
    updatedAt: Date;
}

export type InputData<T> = NewData<Omit<T, keyof Base>, Base>;

export class BaseFilter {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize?: number = 10;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageIndex?: number = 1;

    @IsString()
    @IsOptional()
    keywords?: string;
}

export interface ListChunk<T extends Base> {
    count: number;
    list: T[];
}
