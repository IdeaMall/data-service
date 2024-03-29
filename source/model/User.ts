import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsMobilePhone,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsStrongPassword,
    IsUrl,
    Min,
    ValidateNested
} from 'class-validator';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import { NewData } from 'mobx-restful';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base, BaseFilter, InputData, ListChunk } from './Base';
import { Gender, Role } from './constant';

export class SignInData
    implements Required<Pick<User, 'mobilePhone' | 'password'>>
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
export class User extends Base {
    @IsString()
    @Column({ nullable: true })
    uuid: string;

    @IsMobilePhone()
    @Column({ unique: true })
    mobilePhone: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    nickName?: string;

    @IsEnum(Gender)
    @IsOptional()
    @Column({ enum: Gender, nullable: true })
    gender?: Gender;

    @IsUrl()
    @IsOptional()
    @Column({ nullable: true })
    avatar?: string;

    @IsStrongPassword()
    @Column({ select: false })
    password: string;

    @IsEnum(Role, { each: true })
    @IsOptional()
    @Column('simple-json')
    roles?: Role[];

    @IsString()
    @IsOptional()
    token?: string;

    iat?: number;
}

export abstract class UserBase extends Base {
    @Type(() => User)
    @ValidateNested()
    @ManyToOne(() => User)
    createdBy: User;

    @Type(() => User)
    @ValidateNested()
    @ManyToOne(() => User)
    updatedBy: User;
}

export type UserInputData<T> = NewData<Omit<T, keyof UserBase>, Base>;

export class UserFilter extends BaseFilter implements Partial<InputData<User>> {
    @IsMobilePhone()
    @IsOptional()
    mobilePhone?: string;

    @IsString()
    @IsOptional()
    nickName?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;
}

export class UserListChunk implements ListChunk<User> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => User)
    @ValidateNested({ each: true })
    list: User[];
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
