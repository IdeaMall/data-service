import { AddressOutput, AddressOwner } from '@ideamall/data-model';
import { Column, Entity } from 'typeorm';

import { UserBase } from './User';

@Entity()
export class Address extends UserBase implements AddressOutput {
    @Column({ enum: AddressOwner })
    ownership: AddressOwner;

    @Column()
    country: string;

    @Column()
    province: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    road: string;

    @Column({ nullable: true })
    number?: string;

    @Column()
    building: string;

    @Column({ nullable: true })
    floor?: string;

    @Column({ nullable: true })
    room?: string;

    @Column({ nullable: true })
    zipCode?: string;

    @Column()
    signature: string;

    @Column()
    mobilePhone: string;
}
