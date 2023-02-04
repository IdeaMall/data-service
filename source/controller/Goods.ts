import { GoodsOutput } from '@ideamall/data-model';
import { JsonController } from 'routing-controllers';

import { Goods } from '../model';
import { Controller } from './Base';

@JsonController('/goods')
export class GoodsController extends Controller('/goods', GoodsOutput, Goods) {}
