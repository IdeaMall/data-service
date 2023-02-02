import { AddressModel } from '@ideamall/data-model';
import { JsonController } from 'routing-controllers';

import { Address } from '../model';
import { Controller } from './Base';

@JsonController('/address')
export class AddressController extends Controller(
    '/address',
    AddressModel,
    Address
) {}
