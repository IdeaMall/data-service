import { createClient } from '@supabase/supabase-js';
import { IsString } from 'class-validator';

export const supabase = createClient(
    process.env.SUPABASE_APP_HOST,
    process.env.SUPABASE_APP_KEY
);

export class FileOutput {
    @IsString()
    path: string;
}
