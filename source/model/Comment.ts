import { CommentOutput } from '@ideamall/data-model';
import { Column, JoinTable, ManyToMany } from 'typeorm';

import { Goods } from './Goods';
import { UserBase } from './User';

export class Comment extends UserBase implements CommentOutput {
    @ManyToMany(() => Goods)
    @JoinTable()
    goods: Goods;

    @Column()
    score: number;

    @Column({ nullable: true })
    content?: string;
}