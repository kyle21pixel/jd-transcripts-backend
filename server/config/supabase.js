const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase configuration missing. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your environment variables.');
}

// Client for general operations (with RLS)
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for server-side operations (bypasses RLS)
const supabaseAdmin = supabaseServiceKey 
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null;

module.exports = {
    supabase,
    supabaseAdmin,
    supabaseUrl,
    supabaseKey
};