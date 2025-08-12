const { supabase, supabaseAdmin } = require('../config/supabase');

class SupabaseService {
    constructor() {
        this.supabase = supabase;
        this.supabaseAdmin = supabaseAdmin;
    }

    // Authentication Methods
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Supabase signUp error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Supabase signIn error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Supabase signOut error:', error);
            return { success: false, error: error.message };
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            return { success: true, user };
        } catch (error) {
            console.error('Supabase getCurrentUser error:', error);
            return { success: false, error: error.message };
        }
    }

    async resetPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.FRONTEND_URL}/reset-password`
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Supabase resetPassword error:', error);
            return { success: false, error: error.message };
        }
    }

    // Database Operations
    async createOrder(orderData) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .insert([orderData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Supabase createOrder error:', error);
            return { success: false, error: error.message };
        }
    }

    async getOrders(userId = null, filters = {}) {
        try {
            let query = this.supabase.from('orders').select('*');

            if (userId) {
                query = query.eq('user_id', userId);
            }

            // Apply filters
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null) {
                    query = query.eq(key, filters[key]);
                }
            });

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Supabase getOrders error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateOrder(orderId, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .update(updateData)
                .eq('id', orderId)
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Supabase updateOrder error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteOrder(orderId) {
        try {
            const { error } = await this.supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Supabase deleteOrder error:', error);
            return { success: false, error: error.message };
        }
    }

    // File Storage Operations
    async uploadFile(bucket, filePath, file, options = {}) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    ...options
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Supabase uploadFile error:', error);
            return { success: false, error: error.message };
        }
    }

    async downloadFile(bucket, filePath) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .download(filePath);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Supabase downloadFile error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteFile(bucket, filePath) {
        try {
            const { error } = await this.supabase.storage
                .from(bucket)
                .remove([filePath]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Supabase deleteFile error:', error);
            return { success: false, error: error.message };
        }
    }

    async getPublicUrl(bucket, filePath) {
        try {
            const { data } = this.supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return { success: true, url: data.publicUrl };
        } catch (error) {
            console.error('Supabase getPublicUrl error:', error);
            return { success: false, error: error.message };
        }
    }

    async createSignedUrl(bucket, filePath, expiresIn = 3600) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .createSignedUrl(filePath, expiresIn);

            if (error) throw error;
            return { success: true, url: data.signedUrl };
        } catch (error) {
            console.error('Supabase createSignedUrl error:', error);
            return { success: false, error: error.message };
        }
    }

    // Real-time Subscriptions
    subscribeToOrders(callback, filters = {}) {
        try {
            let subscription = this.supabase
                .channel('orders')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    ...filters
                }, callback);

            subscription.subscribe();
            return subscription;
        } catch (error) {
            console.error('Supabase subscribeToOrders error:', error);
            return null;
        }
    }

    subscribeToUserOrders(userId, callback) {
        return this.subscribeToOrders(callback, {
            filter: `user_id=eq.${userId}`
        });
    }

    unsubscribe(subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    }

    // Admin Operations (using service role key)
    async adminCreateUser(email, password, userData = {}) {
        if (!this.supabaseAdmin) {
            return { success: false, error: 'Admin client not configured' };
        }

        try {
            const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
                email,
                password,
                user_metadata: userData,
                email_confirm: true
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Supabase adminCreateUser error:', error);
            return { success: false, error: error.message };
        }
    }

    async adminDeleteUser(userId) {
        if (!this.supabaseAdmin) {
            return { success: false, error: 'Admin client not configured' };
        }

        try {
            const { error } = await this.supabaseAdmin.auth.admin.deleteUser(userId);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Supabase adminDeleteUser error:', error);
            return { success: false, error: error.message };
        }
    }

    async adminListUsers(page = 1, perPage = 1000) {
        if (!this.supabaseAdmin) {
            return { success: false, error: 'Admin client not configured' };
        }

        try {
            const { data, error } = await this.supabaseAdmin.auth.admin.listUsers({
                page,
                perPage
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Supabase adminListUsers error:', error);
            return { success: false, error: error.message };
        }
    }

    // Utility Methods
    async testConnection() {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select('count', { count: 'exact', head: true });

            if (error) throw error;
            return { success: true, message: 'Supabase connection successful' };
        } catch (error) {
            console.error('Supabase connection test failed:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new SupabaseService();