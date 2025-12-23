//src/api/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL이나 Key가 .env 파일에 없습니다!")
}

//Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey)