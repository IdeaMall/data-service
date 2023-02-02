import { OrderModel } from '@ideamall/data-model';
import { JsonController } from 'routing-controllers';

import { Order } from '../model';
import { Controller } from './Base';

@JsonController('/order')
export class OrderController extends Controller('/order', OrderModel, Order) {}
