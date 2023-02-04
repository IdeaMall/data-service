import { CommentOutput } from '@ideamall/data-model';
import { JsonController } from 'routing-controllers';

import { Comment } from '../model';
import { Controller } from './Base';

@JsonController('/comment')
export class CommentController extends Controller(
    '/comment',
    CommentOutput,
    Comment
) {}
