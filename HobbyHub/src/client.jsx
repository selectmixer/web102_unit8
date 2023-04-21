import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eukrhnayzrvvgvtbzhym.supabase.co'
const supabaseAPI_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1a3JobmF5enJ2dmd2dGJ6aHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExNzQyOTEsImV4cCI6MTk5Njc1MDI5MX0.GCPaUO05nNzBipmEkflitIucKc2vovD2iFA6EzrzdKc'

const supabase = createClient(supabaseUrl, supabaseAPI_KEY)

export default supabase