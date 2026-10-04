import React, { useState } from 'react';

export default function DelegateTaskForm({ decisions, onSubmit, isLoading }) {
  const [selectedDecisionId, setSelectedDecisionId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      decision_id: selectedDecisionId,
      title: taskTitle,
      assignee_email: assigneeEmail,
      due_date: dueDate,
      priority,
      status: 'Pending'
    });
    // Reset form after submission
    setTaskTitle('');
    setAssigneeEmail('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-2">Delegate Action Item</h3>
      
      <select 
        value={selectedDecisionId} 
        onChange={(e) => setSelectedDecisionId(e.target.value)}
        className="p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        required
      >
        <option value="">-- Link to Board Decision --</option>
        {decisions.map(d => (
          <option key={d.id} value={d.id}>{d.meeting_title}</option>
        ))}
      </select>

      <input 
        type="text" 
        placeholder="Action Item Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        required
      />

      <input 
        type="email" 
        placeholder="Assignee Email"
        value={assigneeEmail}
        onChange={(e) => setAssigneeEmail(e.target.value)}
        className="p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        required
      />

      <div className="flex gap-3">
        <input 
          type="date" 
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          required
        />
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-2 bg-slate-900 text-white p-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-70"
      >
        {isLoading ? 'Assigning...' : 'Assign Action'}
      </button>
    </form>
  );
}