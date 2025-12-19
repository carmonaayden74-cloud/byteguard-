import { supabase } from './supabase';

export async function saveScan(userId, toolName, target, results, status = 'completed') {
    if (!userId) return null;

    try {
        const { data, error } = await supabase
            .from('scans')
            .insert([
                {
                    user_id: userId,
                    tool_name: toolName,
                    target: target,
                    results: results,
                    status: status,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving scan to history:', error);
        return null;
    }
}
