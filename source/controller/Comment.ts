import { JsonController } from 'routing-controllers';

import { Comment } from '../model';
import { Controller } from './Base';

@JsonController('/comment')
export class CommentController extends Controller(
    '/comment',
    Comment,
    Comment
) {}
