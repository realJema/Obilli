import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/types'

export const supabase = createClientComponentClient<Database>() 
