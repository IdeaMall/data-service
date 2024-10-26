import { Type } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsInt,
    IsJWT,
    IsMobilePhone,
    IsOptional,
    IsString,
    IsStrongPassword,
    IsUrl,
    IsUUID,
    Min,
    ValidateNested
} from 'class-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ParameterizedContext } from 'koa';
import { NewData } from 'mobx-restful';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Base, BaseFilter, InputData, ListChunk } from './Base';
import { Gender, Role } from './constant';

export class SignInData
    implements Partial<Pick<User, 'mobilePhone' | 'password'>>
{
    @IsMobilePhone()
    mobilePhone: string;

    @IsString()
    code: string;

    @IsStrongPassword()
    @IsOptional()
    password?: string;
}

export interface JWTAction {
    context?: ParameterizedContext<JsonWebTokenError | { user: User }>;
}

@Entity()
export class User extends Base {
    @IsUUID()
    @IsOptional()
    @Column('uuid')
    uuid: string;

    @IsMobilePhone()
    @Column({ unique: true })
    mobilePhone: string;

    @IsEmail()
    @IsOptional()
    @Column({ nullable: true })
    email?: string;

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

    @IsJWT()
    @IsOptional()
    token?: string;
}

export abstract class UserBase extends Base {
    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    createdBy: User;

    @Type(() => User)
    @ValidateNested()
    @IsOptional()
    @ManyToOne(() => User)
    updatedBy?: User;
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

export class UserBaseFilter
    extends BaseFilter
    implements Partial<InputData<UserBase>>
{
    @IsInt()
    @Min(1)
    @IsOptional()
    createdBy?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    updatedBy?: number;
}

export class Captcha {
    @IsString()
    token: string;

    @IsUrl()
    link: string;
}

export class SMSCodeInput {
    @IsMobilePhone()
    mobilePhone: string;

    @IsString()
    @IsOptional()
    captchaToken?: string;

    @IsString()
    @IsOptional()
    captchaCode?: string;
}
