
import React, { useState } from 'https://esm.sh/react@^19.1.0';
import Modal from './Modal.tsx';

interface MemoryVaultModalProps {
    isOpen: boolean;
    onClose: () => void;
    memories: string[];
    onUpdateMemories: (memories: string[]) => void;
}

const MemoryVaultModal: React.FC<MemoryVaultModalProps> = ({ isOpen, onClose, memories, onUpdateMemories }) => {
    const [newMemory, setNewMemory] = useState('');

    const handleAddMemory = () => {
        if (newMemory.trim()) {
            onUpdateMemories([newMemory.trim(), ...memories]);
            setNewMemory('');
        }
    };

    const handleDeleteMemory = (index: number) => {
        onUpdateMemories(memories.filter((_, i) => i !== index));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full bg-white dark:bg-[#121212]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Teach AI (Memory Vault)</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add facts, preferences, or instructions for the AI to remember across all chats.</p>
                </div>

                <div className="p-4 flex-shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMemory}
                            onChange={(e) => setNewMemory(e.target.value)}
                            placeholder="e.g., I prefer concise answers."
                            className="flex-1 w-full px-4 py-2 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddMemory}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            disabled={!newMemory.trim()}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-4 overflow-y-auto">
                    {memories.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">The memory vault is empty.</p>
                    ) : (
                        <ul className="space-y-3">
                            {memories.map((memory, index) => (
                                <li key={index} className="group flex items-center justify-between bg-gray-100 dark:bg-[#1e1e1e] p-3 rounded-lg">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 flex-1 break-words">{memory}</p>
                                    <button
                                        onClick={() => handleDeleteMemory(index)}
                                        className="ml-4 p-1.5 rounded-full text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete memory"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default MemoryVaultModal;
