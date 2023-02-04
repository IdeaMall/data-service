import { GoodsOutput } from '@ideamall/data-model';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Category } from './Category';
import { UserBase } from './User';

@Entity()
export class Goods extends UserBase implements GoodsOutput {
    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column('simple-array')
    images: string[];

    @Column()
    price: number;

    @ManyToOne(() => Category)
    category: Category;
}
