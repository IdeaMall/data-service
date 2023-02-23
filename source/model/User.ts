import {
    Gender,
    Role,
    UserBaseOutput,
    UserInput,
    UserOutput
} from '@ideamall/data-model';
import { IsPhoneNumber, IsString } from 'class-validator';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './Base';

export class SignInData
    implements Required<Pick<UserInput, 'mobilePhone' | 'password'>>
{
    @IsPhoneNumber()
    mobilePhone: string;

    @IsString()
    password: string;
}

export interface JWTAction {
    context?: ParameterizedContext<
        JsonWebTokenError | { user: User | AuthingSession }
    >;
}

@Entity()
export class User extends Base implements UserInput, UserOutput {
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

    @Column('simple-json')
    roles: Role[];
}

export abstract class UserBase extends Base implements UserBaseOutput {
    @ManyToOne(() => User)
    createdBy: User;

    @ManyToOne(() => User)
    updatedBy: User;
}

export type AuthingAddress = Partial<
    Record<'country' | 'postal_code' | 'region' | 'formatted', string>
>;

export type AuthingUser = Record<
    'type' | 'userPoolId' | 'appId' | 'id' | '_id' | 'userId' | 'clientId',
    string
> &
    Partial<
        Record<'email' | 'phone' | 'username' | 'unionid' | 'openid', string>
    >;

export interface AuthingSession
    extends JwtPayload,
        Pick<AuthingUser, 'username' | 'unionid'>,
        Record<'userpool_id' | 'gender' | 'picture', string>,
        Partial<
            Record<
                | 'external_id'
                | 'email'
                | 'website'
                | 'phone_number'
                | 'name'
                | 'preferred_username'
                | 'nickname'
                | 'family_name'
                | 'middle_name'
                | 'given_name'
                | 'birthdate'
                | 'locale'
                | 'zoneinfo',
                string
            >
        > {
    phone_number_verified: boolean;
    email_verified: boolean;

    data: AuthingUser;
    profile?: any;
    address: AuthingAddress;

    updated_at: Date;
}
