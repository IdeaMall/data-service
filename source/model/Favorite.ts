import { FavoriteModel, FavoriteType } from '@ideamall/data-model';
import { Column, JoinTable, ManyToMany } from 'typeorm';

import { Goods } from './Goods';
import { UserBase } from './User';

export class Favorite extends UserBase implements FavoriteModel {
    @Column({ enum: FavoriteType })
    type: FavoriteType;

    @ManyToMany(() => Goods)
    @JoinTable()
    goods: Goods;
}
