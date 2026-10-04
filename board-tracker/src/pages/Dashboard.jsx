import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGovernanceData } from '../hooks/useGovernanceData';
import ActionItemCard from '../components/ActionItemCard';
import DelegateTaskForm from '../components/DelegateTaskForm';
import CreateDecisionForm from '../components/CreateDecisionForm';
import { LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  // Extract createDecision from the hook alongside the others
  const { decisions, tasks, assignTask, updateTaskStatus, createDecision, isMutating } = useGovernanceData(user?.email);

  // In a real enterprise app, roles would be verified via JWT claims.
  // For this demonstration, we assume specific admin emails.
  const isAdmin = user?.email?.includes('admin') || user?.email === 'ceo@nexuscorp.com';

  // Filter tasks. RLS protects the DB, but this filters the UI view cleanly.
  const visibleTasks = isAdmin 
    ? tasks 
    : tasks.filter(t => t.assignee_email.toLowerCase() === user?.email?.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Enterprise Top Navigation */}
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-sky-400" />
            <h1 className="text-xl font-semibold tracking-wide">NexusCorp Governance</h1>
            {isAdmin && <span className="bg-sky-900 text-sky-200 text-xs px-2 py-1 rounded border border-sky-700 ml-2">Admin Mode</span>}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">
              Session: <strong className="text-white">{user?.email}</strong>
            </span>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md text-sm transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Admin Controls */}
        {isAdmin && (
          <aside className="lg:col-span-1 flex flex-col gap-6">
            {/* New Decision Form Added Here */}
            <CreateDecisionForm 
              onSubmit={createDecision} 
              isLoading={isMutating} 
            />
            
            <DelegateTaskForm 
              decisions={decisions} 
              onSubmit={assignTask} 
              isLoading={isMutating} 
            />
            
            <div className="bg-sky-50 border border-sky-100 p-4 rounded-lg flex items-start gap-3">
              <ShieldAlert className="text-sky-600 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-sky-800 leading-relaxed">
                <strong>RLS Active:</strong> Row-Level Security is currently enforcing data access at the PostgreSQL tier. Audit logs are automatically generating on status mutations.
              </p>
            </div>
          </aside>
        )}

        {/* Right Column: Tracking Board */}
        <section className={`flex flex-col gap-4 ${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3 max-w-4xl mx-auto w-full'}`}>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 border-b pb-3 border-slate-100">
              {isAdmin ? 'Global Action Log' : 'My Assigned Actions'}
            </h2>

            {visibleTasks.length === 0 ? (
              <p className="text-slate-500 italic text-sm">No actionable items found for your current clearance level.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleTasks.map(task => (
                  <ActionItemCard 
                    key={task.id}
                    task={task}
                    linkedDecision={decisions.find(d => d.id === task.decision_id)}
                    onStatusChange={updateTaskStatus}
                    isAssignee={task.assignee_email.toLowerCase() === user?.email?.toLowerCase() || isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}