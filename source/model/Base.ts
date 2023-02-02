import { BaseModel } from '@ideamall/data-model';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

export abstract class Base implements BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
