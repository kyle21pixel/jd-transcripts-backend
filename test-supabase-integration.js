// Test script to verify Supabase integration
// Run this with: node test-supabase-integration.js

const { supabase, supabaseAdmin } = require('./server/config/supabase');

async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase Integration...\n');

    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.log('❌ Connection failed:', error.message);
        } else {
            console.log('✅ Connection successful');
        }
    } catch (err) {
        console.log('❌ Connection error:', err.message);
    }

    // Test 2: Auth service
    console.log('\n2. Testing auth service...');
    try {
        const { data, error } = await supabase.auth.getSession();
        console.log('✅ Auth service accessible');
    } catch (err) {
        console.log('❌ Auth service error:', err.message);
    }

    // Test 3: Storage service
    console.log('\n3. Testing storage service...');
    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
            console.log('❌ Storage error:', error.message);
        } else {
            console.log('✅ Storage service accessible');
            console.log('📦 Available buckets:', data.map(b => b.name).join(', ') || 'None');
        }
    } catch (err) {
        console.log('❌ Storage service error:', err.message);
    }

    // Test 4: Admin client (if configured)
    console.log('\n4. Testing admin client...');
    if (supabaseAdmin) {
        try {
            const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
            if (error) {
                console.log('❌ Admin client error:', error.message);
            } else {
                console.log('✅ Admin client working');
                console.log('👥 Total users:', data.users?.length || 0);
            }
        } catch (err) {
            console.log('❌ Admin client error:', err.message);
        }
    } else {
        console.log('⚠️ Admin client not configured (SUPABASE_SERVICE_ROLE_KEY missing)');
    }

    console.log('\n🎉 Supabase integration test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up your environment variables in .env files');
    console.log('2. Run the database schema in Supabase SQL Editor');
    console.log('3. Create storage buckets in Supabase dashboard');
    console.log('4. Start your applications with npm run dev');
}

// Run the test
testSupabaseConnection().catch(console.error);