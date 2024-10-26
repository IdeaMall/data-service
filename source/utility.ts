import { HTTPClient, HTTPError } from 'koajax';
import { HttpError } from 'routing-controllers';
import { FindOptionsWhere, ILike } from 'typeorm';

import { Base } from './model';

export const {
    NODE_ENV,
    PORT = 8080,
    DATABASE_URL,
    SUPABASE_APP_HOST,
    SUPABASE_APP_KEY,
    SUPABASE_FILE_BUCKET,
    APP_SECRET,
    LEANCLOUD_API_HOST,
    LEANCLOUD_APP_ID,
    LEANCLOUD_APP_KEY
} = process.env;

export const isProduct = NODE_ENV === 'production';

export const searchConditionOf = <T extends Base>(
    keys: (keyof T)[],
    keywords = '',
    filter?: FindOptionsWhere<T>
) =>
    keywords
        ? keys.map(key => ({ [key]: ILike(`%${keywords}%`), ...filter }))
        : filter;

export const leanClient = new HTTPClient({
    baseURI: `https://${LEANCLOUD_API_HOST}/1.1/`,
    responseType: 'json'
}).use(async ({ request }, next) => {
    request.headers = {
        ...request.headers,
        'X-LC-Id': LEANCLOUD_APP_ID,
        'X-LC-Key': LEANCLOUD_APP_KEY
    };
    try {
        await next();
    } catch (error) {
        const { response } = error as HTTPError<{
            code: number;
            error: string;
        }>;
        const { status, body } = response;

        throw new HttpError(status, body.error);
    }
});
