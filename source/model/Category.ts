import { CategoryModel } from '@ideamall/data-model';
import { Column, Entity } from 'typeorm';

import { UserBase } from './User';

@Entity()
export class Category extends UserBase implements CategoryModel {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    parentId?: number;
}
