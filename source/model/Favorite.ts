import { FavoriteOutput, FavoriteType } from '@ideamall/data-model';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { Goods } from './Goods';
import { UserBase } from './User';

@Entity()
export class Favorite extends UserBase implements FavoriteOutput {
    @Column({ enum: FavoriteType })
    type: FavoriteType;

    @ManyToMany(() => Goods)
    @JoinTable()
    goods: Goods;
}
