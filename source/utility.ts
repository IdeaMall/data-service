export const {
    NODE_ENV,
    PORT = 8080,
    DATABASE_URL,
    SUPABASE_APP_HOST,
    SUPABASE_APP_KEY,
    SUPABASE_FILE_BUCKET,
    AUTHING_APP_SECRET
} = process.env;

export const isProduct = NODE_ENV === 'production';
