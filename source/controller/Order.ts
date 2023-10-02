import { JsonController } from 'routing-controllers';

import { Order } from '../model';
import { Controller } from './Base';

@JsonController('/order')
export class OrderController extends Controller('/order', Order, Order) {}
