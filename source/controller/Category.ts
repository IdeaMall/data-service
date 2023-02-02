import { CategoryModel } from '@ideamall/data-model';
import { JsonController } from 'routing-controllers';

import { Category } from '../model';
import { Controller } from './Base';

@JsonController('/category')
export class CategoryController extends Controller(
    '/category',
    CategoryModel,
    Category
) {}
