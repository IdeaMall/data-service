import { CategoryOutput } from '@ideamall/data-model';
import { Column, Entity } from 'typeorm';

import { UserBase } from './User';

@Entity()
export class Category extends UserBase implements CategoryOutput {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    parentId?: number;
}
