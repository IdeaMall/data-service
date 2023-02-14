import { fromBuffer } from 'file-type';
import { File } from '@koa/multer';
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

@JsonController('/file')
export class FileController {
    @Post()
    @Authorized()
    @ResponseSchema(FileOutput)
    async uploadOne(
        @CurrentUser() { mobilePhone }: User,
        @UploadedFile('data') { originalname, buffer }: File
    ) {
        const { ext, mime } = (await fromBuffer(buffer)) || {};

        const path = `${mobilePhone}/${originalname || `${uniqueID()}.${ext}`}`;

        const { error, data } = await supabase.storage
            .from(process.env.SUPABASE_FILE_BUCKET)
            .upload(path, buffer, { contentType: mime, upsert: true });

        if (error) throw new BadRequestError(error.message);

        return data;
    }
}
