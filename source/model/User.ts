import { Gender, UserBaseModel, UserModel } from '@ideamall/data-model';
import { IsPhoneNumber, IsString } from 'class-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './Base';

export class SignInData
    implements Required<Pick<UserModel, 'mobilePhone' | 'password'>>
{
    @IsPhoneNumber()
    mobilePhone: string;

    @IsString()
    password: string;
}

export interface JWTAction {
    context?: ParameterizedContext<JsonWebTokenError | { user: UserModel }>;
}

@Entity()
export class User extends Base implements UserModel {
    @Column({ unique: true })
    mobilePhone: string;

    @Column({ nullable: true })
    nickName?: string;

    @Column({ enum: Gender, nullable: true })
    gender?: Gender;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ select: false })
    password: string;
}

export abstract class UserBase extends Base implements UserBaseModel {
    @ManyToOne(() => User)
    createdBy: User;

    @ManyToOne(() => User)
    updatedBy: User;
}
