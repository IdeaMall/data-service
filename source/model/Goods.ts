import { GoodsOutput, GoodsStyle } from '@ideamall/data-model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Address } from './Address';
import { Category } from './Category';
import { GoodsItem } from './GoodsItem';
import { UserBase } from './User';

@Entity()
export class Goods extends UserBase implements GoodsOutput {
    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Category)
    category: Category;

    @Column({ type: 'simple-json', nullable: true })
    styles?: GoodsStyle[];

    @OneToMany(() => GoodsItem, ({ goods }) => goods)
    items: GoodsItem[];

    @ManyToOne(() => Address)
    store: Address;
}
