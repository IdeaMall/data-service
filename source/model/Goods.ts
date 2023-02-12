import { GoodsOutput } from '@ideamall/data-model';
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

    @Column({ nullable: true })
    styleName?: string;

    @Column({ type: 'simple-array', nullable: true })
    styleValues?: string[];

    @OneToMany(() => GoodsItem, ({ goods }) => goods)
    items: GoodsItem[];

    @ManyToOne(() => Address)
    store: Address;
}
