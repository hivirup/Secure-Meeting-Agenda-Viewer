import React from 'react';
import StatusBadge from './StatusBadge';
import { Calendar, AlertCircle } from 'lucide-react';

export default function ActionItemCard({ task, linkedDecision, onStatusChange, isAssignee }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm hover:shadow-md transition-shadow gap-4">
      
      {/* Task Metadata */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-slate-800">{task.title}</h3>
        {linkedDecision && (
          <span className="text-xs font-medium text-sky-600">
            Decision: {linkedDecision.meeting_title}
          </span>
        )}
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> Due: {task.due_date}
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle size={14} /> Priority: <strong className="text-slate-700">{task.priority}</strong>
          </span>
          <span className="text-slate-400">| Assignee: {task.assignee_email}</span>
        </div>
      </div>
      
      {/* Interactive / Static Status UI */}
      <div className="flex items-center w-full md:w-auto">
        {isAssignee ? (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className={`p-2 rounded-md border font-semibold text-sm cursor-pointer outline-none focus:ring-2 focus:ring-sky-500 w-full md:w-auto transition-colors
              ${task.status === 'Completed' ? 'bg-green-50 text-green-800 border-green-200' : 
                task.status === 'In Progress' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 
                'bg-slate-50 text-slate-600 border-slate-200'}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          <StatusBadge status={task.status} />
        )}
      </div>
    </div>
  );
}