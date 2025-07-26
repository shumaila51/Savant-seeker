
import React, { useState } from 'https://esm.sh/react@^19.1.0';
import { type LifemapEntry, type Goal, LifemapEntryType } from '../types.ts';

interface LifemapViewProps {
    entries: LifemapEntry[];
    goals: Goal[];
    onAddEntry: (entry: Omit<LifemapEntry, 'id' | 'timestamp'>) => void;
    onDeleteEntry: (id: string) => void;
    onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;
    onUpdateGoal: (goal: Goal) => void;
    onDeleteGoal: (id: string) => void;
    onExportData: () => void;
    onDeleteAllData: () => void;
}

const EntryCard: React.FC<{ entry: LifemapEntry; onDelete: (id: string) => void }> = ({ entry, onDelete }) => (
    <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-lg shadow-sm group relative">
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(entry.timestamp).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="mt-2 text-gray-800 dark:text-gray-200">{entry.content}</p>
        <button onClick={() => onDelete(entry.id)} className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    </div>
);

const GoalCard: React.FC<{ goal: Goal; onUpdate: (goal: Goal) => void; onDelete: (id: string) => void }> = ({ goal, onUpdate, onDelete }) => (
    <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{goal.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                 <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Created: {new Date(goal.createdAt).toLocaleDateString()}
                    {goal.targetDate && ` | Target: ${new Date(goal.targetDate).toLocaleDateString()}`}
                </p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <select 
                    value={goal.status} 
                    onChange={(e) => onUpdate({ ...goal, status: e.target.value as 'active' | 'completed' | 'archived' })}
                    className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                </select>
                <button onClick={() => onDelete(goal.id)} className="p-1 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    </div>
);

const AddEntryForm: React.FC<{ onAddEntry: LifemapViewProps['onAddEntry'] }> = ({ onAddEntry }) => {
    const [content, setContent] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onAddEntry({ type: LifemapEntryType.NOTE, content });
        setContent('');
    };
    return (
         <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Add a New Note or Check-in</h3>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="How was your day? What's on your mind?"
                className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                rows={3}
            />
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={!content.trim()}>
                Add Entry
            </button>
        </form>
    );
};

const AddGoalForm: React.FC<{ onAddGoal: LifemapViewProps['onAddGoal'] }> = ({ onAddGoal }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAddGoal({ title, description });
        setTitle('');
        setDescription('');
    };
    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Set a New Goal</h3>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal title (e.g., Learn React)"
                className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm mb-2"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                rows={2}
            />
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={!title.trim()}>
                Add Goal
            </button>
        </form>
    );
};


const LifemapView: React.FC<LifemapViewProps> = ({ entries, goals, onAddEntry, onDeleteEntry, onAddGoal, onUpdateGoal, onDeleteGoal, onExportData, onDeleteAllData }) => {
    const [activeTab, setActiveTab] = useState<'timeline' | 'goals'>('timeline');

    return (
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#0a0a0a] h-full">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lifemap</h2>
                        <p className="text-gray-500 dark:text-gray-400">Your personal journey, tracked and remembered.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onExportData} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">Export Data (JSON)</button>
                        <button onClick={onDeleteAllData} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800/50 dark:hover:bg-red-900">Delete All</button>
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <nav className="flex space-x-4">
                        <button onClick={() => setActiveTab('timeline')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'timeline' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                            Timeline ({entries.length})
                        </button>
                        <button onClick={() => setActiveTab('goals')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'goals' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                            Goals ({goals.filter(g => g.status === 'active').length})
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'timeline' && (
                    <div>
                        <AddEntryForm onAddEntry={onAddEntry} />
                        <div className="space-y-4">
                            {entries.length > 0 ? entries.map(entry => (
                                <EntryCard key={entry.id} entry={entry} onDelete={onDeleteEntry} />
                            )) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">Your timeline is empty. Add a note to get started.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'goals' && (
                     <div>
                        <AddGoalForm onAddGoal={onAddGoal} />
                        <div className="space-y-4">
                             {goals.length > 0 ? goals.map(goal => (
                                <GoalCard key={goal.id} goal={goal} onUpdate={onUpdateGoal} onDelete={onDeleteGoal} />
                            )) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">You haven't set any goals yet.</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LifemapView;
