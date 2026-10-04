import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useGovernanceData(userEmail) {
  const [decisions, setDecisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDecisions();
    fetchTasks();

    const channel = supabase
      .channel('governance-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'action_items' },
        () => {
          fetchTasks(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDecisions = async () => {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setDecisions(data);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('action_items')
      .select('*')
      .order('due_date', { ascending: true });
    if (!error && data) setTasks(data);
  };

  const assignTask = async (taskPayload) => {
    setIsLoading(true);
    const { error } = await supabase.from('action_items').insert([taskPayload]);
    setIsLoading(false);
    if (error) throw new Error(error.message);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const { error: updateError } = await supabase
      .from('action_items')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (!updateError) {
      await supabase.from('audit_logs').insert([
        {
          action_item_id: taskId,
          changed_by: userEmail,
          action_summary: `Status securely transitioned to ${newStatus}`
        }
      ]);
      
      fetchTasks(); 
    } else {
      console.error("Database update failed:", updateError.message);
    }
  };

  const createDecision = async (decisionPayload) => {
    setIsLoading(true);
    const { error } = await supabase.from('decisions').insert([decisionPayload]);
    setIsLoading(false);
    
    if (error) {
      console.error("Failed to create decision:", error.message);
    } else {
      fetchDecisions();
    }
  };

  return {
    decisions,
    tasks,
    assignTask,
    updateTaskStatus,
    createDecision,
    isMutating: isLoading
  };
}