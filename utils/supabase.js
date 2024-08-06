import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client for public usage (client-side)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// Function to initialize the Supabase client for server-side usage
export const getServiceSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );


//import { createClient } from '@supabase/supabase-js';

//export const supabase = createClient(
//  process.env.NEXT_PUBLIC_SUPABASE_URL,
//  process.env.NEXT_PUBLIC_SUPABASE_KEY
//);

//export const getServiceSupabase = () =>
//  createClient(
//    process.env.NEXT_PUBLIC_SUPABASE_URL,
//    process.env.SUPABASE_SERVICE_KEY
//  );
