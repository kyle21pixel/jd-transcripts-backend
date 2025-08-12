import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

// Authentication Hook
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                setUser(session?.user ?? null);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signUp = useCallback(async (email, password, userData = {}) => {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const signIn = useCallback(async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (email) => {
        try {
            setLoading(true);
            setError(null);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        isAuthenticated: !!user
    };
};

// Database Hook
export const useSupabaseQuery = (table, query = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let supabaseQuery = supabase.from(table).select('*');

            // Apply filters
            Object.keys(query).forEach(key => {
                if (query[key] !== undefined && query[key] !== null) {
                    supabaseQuery = supabaseQuery.eq(key, query[key]);
                }
            });

            const { data, error } = await supabaseQuery;
            if (error) throw error;

            setData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [table, JSON.stringify(query)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
};

// Real-time Subscription Hook
export const useSupabaseSubscription = (table, callback, filters = {}) => {
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const channel = supabase
            .channel(`${table}_changes`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: table,
                ...filters
            }, callback);

        channel.subscribe();
        setSubscription(channel);

        return () => {
            if (channel) {
                channel.unsubscribe();
            }
        };
    }, [table, callback, JSON.stringify(filters)]);

    return subscription;
};

// File Upload Hook
export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFile = useCallback(async (bucket, filePath, file, options = {}) => {
        try {
            setUploading(true);
            setError(null);

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    ...options
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setUploading(false);
        }
    }, []);

    const deleteFile = useCallback(async (bucket, filePath) => {
        try {
            setError(null);
            const { error } = await supabase.storage
                .from(bucket)
                .remove([filePath]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    }, []);

    const getPublicUrl = useCallback((bucket, filePath) => {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    }, []);

    return {
        uploadFile,
        deleteFile,
        getPublicUrl,
        uploading,
        error
    };
};

// Orders Hook (specific to your application)
export const useOrders = (userId = null) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let query = supabase.from('orders').select('*');
            
            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            setOrders(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const createOrder = useCallback(async (orderData) => {
        try {
            setError(null);
            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select();

            if (error) throw error;
            
            // Update local state
            setOrders(prev => [data[0], ...prev]);
            return { success: true, data: data[0] };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    }, []);

    const updateOrder = useCallback(async (orderId, updateData) => {
        try {
            setError(null);
            const { data, error } = await supabase
                .from('orders')
                .update(updateData)
                .eq('id', orderId)
                .select();

            if (error) throw error;

            // Update local state
            setOrders(prev => prev.map(order => 
                order.id === orderId ? data[0] : order
            ));
            return { success: true, data: data[0] };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    }, []);

    const deleteOrder = useCallback(async (orderId) => {
        try {
            setError(null);
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;

            // Update local state
            setOrders(prev => prev.filter(order => order.id !== orderId));
            return { success: true };
        } catch (error) {
            setError(error.message);
            return { success: false, error: error.message };
        }
    }, []);

    // Subscribe to real-time changes
    useSupabaseSubscription('orders', (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
            case 'INSERT':
                if (!userId || newRecord.user_id === userId) {
                    setOrders(prev => [newRecord, ...prev]);
                }
                break;
            case 'UPDATE':
                if (!userId || newRecord.user_id === userId) {
                    setOrders(prev => prev.map(order => 
                        order.id === newRecord.id ? newRecord : order
                    ));
                }
                break;
            case 'DELETE':
                setOrders(prev => prev.filter(order => order.id !== oldRecord.id));
                break;
            default:
                break;
        }
    }, userId ? { filter: `user_id=eq.${userId}` } : {});

    return {
        orders,
        loading,
        error,
        createOrder,
        updateOrder,
        deleteOrder,
        refetch: fetchOrders
    };
};