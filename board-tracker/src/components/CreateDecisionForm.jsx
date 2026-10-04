import React, { useState } from 'react';

export default function CreateDecisionForm({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      meeting_title: title,
      decision_text: text,
    });
    setTitle('');
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-2">Record Board Decision</h3>
      
      <input 
        type="text" 
        placeholder="Meeting Title (e.g., Q4 Strategy Sync)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 outline-none"
        required
      />

      <textarea 
        placeholder="Official decision summary..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
        rows="3"
        required
      />

      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-2 bg-sky-700 text-white p-2 rounded-md text-sm font-semibold hover:bg-sky-800 transition-colors disabled:opacity-70"
      >
        {isLoading ? 'Recording...' : 'Log Decision'}
      </button>
    </form>
  );
}