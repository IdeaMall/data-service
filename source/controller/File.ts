import { File } from '@koa/multer';
import type {} from '@supabase/storage-js';
import { fromBuffer } from 'file-type';
import {
    Authorized,
    BadRequestError,
    CurrentUser,
    JsonController,
    Post,
    UploadedFile
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { uniqueID } from 'web-utility';

import { FileOutput, supabase, User } from '../model';
import { SUPABASE_FILE_BUCKET } from '../utility';

@JsonController('/file')
export class FileController {
    storage = supabase.storage.from(SUPABASE_FILE_BUCKET);

    @Post()
    @Authorized()
    @ResponseSchema(FileOutput)
    async uploadOne(
        @CurrentUser() { mobilePhone }: User,
        @UploadedFile('data') { originalname, buffer }: File
    ) {
        const { ext, mime } = (await fromBuffer(buffer)) || {};

        const path = `${mobilePhone}/${originalname || `${uniqueID()}.${ext}`}`;

        const { error } = await this.storage.upload(path, buffer, {
            contentType: mime
        });

        if (error) throw new BadRequestError(error.message);

        const { publicUrl } = this.storage.getPublicUrl(path).data;

        return { path: publicUrl };
    }
}
