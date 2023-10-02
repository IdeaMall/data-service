import { JsonController } from 'routing-controllers';

import { Favorite } from '../model';
import { Controller } from './Base';

@JsonController('/favorite')
export class FavoriteController extends Controller(
    '/favorite',
    Favorite,
    Favorite
) {}
