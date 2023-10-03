import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsMobilePhone,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from 'class-validator';
import { Column, Entity } from 'typeorm';

import { ListChunk } from './Base';
import { UserBase } from './User';
import { AddressOwner } from './constant';

@Entity()
export class Address extends UserBase {
    @IsEnum(AddressOwner)
    @Column({ enum: AddressOwner })
    ownership: AddressOwner;

    @IsString()
    @Column()
    country: string;

    @IsString()
    @Column()
    province: string;

    @IsString()
    @Column()
    city: string;

    @IsString()
    @Column()
    district: string;

    @IsString()
    @Column()
    road: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    number?: string;

    @IsString()
    @Column()
    building: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    floor?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    room?: string;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    zipCode?: string;

    @IsString()
    @Column()
    signature: string;

    @IsMobilePhone()
    @Column()
    mobilePhone: string;
}

export class AddressListChunk implements ListChunk<Address> {
    @IsInt()
    @Min(0)
    count: number;

    @Type(() => Address)
    @ValidateNested({ each: true })
    list: Address[];
}
