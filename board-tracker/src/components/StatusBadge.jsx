import React from 'react';

export default function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold border rounded-full ${getStyles()}`}>
      {status}
    </span>
  );
}