
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://lwrwedbfeommnskzzcgx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cndlZGJmZW9tbW5za3p6Y2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODU0MDksImV4cCI6MjA2NTI2MTQwOX0.Pr6tNHBKMFDQ9l30I1ZQbbtHmPc6-sOHGIcC59sfxUg'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
