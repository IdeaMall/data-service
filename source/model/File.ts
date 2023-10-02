import { createClient } from '@supabase/supabase-js';
import { IsString } from 'class-validator';

import { SUPABASE_APP_HOST, SUPABASE_APP_KEY } from '../utility';

export const supabase = createClient(SUPABASE_APP_HOST, SUPABASE_APP_KEY);

export class FileOutput {
    @IsString()
    path: string;
}
