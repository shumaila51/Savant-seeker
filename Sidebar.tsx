
import React from 'https://esm.sh/react@^19.1.0';
import { type Chat, type User } from '../types.ts';
import { APP_NAME, BrainChipIcon, LifemapIcon, CuriosityIcon, SparklesIcon, DevToolIcon } from '../constants.tsx';
import { useTheme } from '../contexts/ThemeContext.tsx';
import CuriosityMeter from './CuriosityMeter.tsx';
import { type CuriosityStats } from '../utils.ts';

interface SidebarProps {
    chats: Chat[];
    activeChatId: string | null;
    onNewChat: () => void;
    onNewTemporaryChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: User | null;
    onLogout: () => void;
    onToggleMemoryVault: () => void;
    onToggleGadgets: () => void;
    onToggleDevTools: () => void;
    onShowLifemap: () => void;
    curiosityStats: CuriosityStats | null;
}

const ChatHistoryItem: React.FC<{ chat: Chat; isActive: boolean; onSelect: () => void; onDelete: (e: React.MouseEvent) => void }> = ({ chat, isActive, onSelect, onDelete }) => (
    <div
        onClick={onSelect}
        className={`group relative flex items-center justify-between w-full p-2.5 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
    >
        <p className="truncate text-sm font-medium">{chat.title}</p>
        <button onClick={onDelete} className={`absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white/70 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} title="Toggle Theme" className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0">
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
        </button>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onNewChat, onNewTemporaryChat, onSelectChat, onDeleteChat, isOpen, user, onLogout, onToggleMemoryVault, onToggleGadgets, onToggleDevTools, onShowLifemap, curiosityStats }) => {
    
    const [isCuriosityMeterOpen, setIsCuriosityMeterOpen] = React.useState(false);
    const sortedChats = [...chats].sort((a, b) => b.createdAt - a.createdAt);
    
    return (
        <aside className={`flex-shrink-0 bg-gray-50 dark:bg-[#1e1e1e] flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="p-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center leading-tight">
                    <span className="block text-sm font-light tracking-[0.05em] text-gray-500 dark:text-gray-400">GOOGLE</span>
                    <span className="block text-lg font-light tracking-[0.1em] text-gray-800 dark:text-gray-200">SAVANT</span>
                    <span className="block -mt-1 text-2xl font-black tracking-tighter text-gray-900 dark:text-white">SEEKER</span>
                </div>
            </div>
            <div className="p-2 space-y-2 flex-shrink-0">
                <button
                    onClick={() => onNewChat()}
                    className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Chat
                </button>
                <div className="grid grid-cols-2 gap-2">
                     <button
                        onClick={onShowLifemap}
                        title="Lifemap"
                        className="flex items-center justify-center w-full px-2 py-2 text-xs font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700/60 hover:bg-gray-300 dark:hover:bg-gray-600/80 rounded-lg transition-colors duration-200"
                    >
                        <LifemapIcon />
                        Lifemap
                    </button>
                     <button
                        onClick={onToggleMemoryVault}
                        title="Teach AI"
                        className="flex items-center justify-center w-full px-2 py-2 text-xs font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700/60 hover:bg-gray-300 dark:hover:bg-gray-600/80 rounded-lg transition-colors duration-200"
                    >
                        <BrainChipIcon />
                        Teach AI
                    </button>
                    <button
                        onClick={() => setIsCuriosityMeterOpen(p => !p)}
                        title="Toggle Curiosity Meter"
                        className="flex items-center justify-center w-full px-2 py-2 text-xs font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700/60 hover:bg-gray-300 dark:hover:bg-gray-600/80 rounded-lg transition-colors duration-200"
                    >
                        <CuriosityIcon />
                        Curiosity
                    </button>
                    <button
                        onClick={onToggleGadgets}
                        title="Fun Gadgets"
                        className="flex items-center justify-center w-full px-2 py-2 text-xs font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700/60 hover:bg-gray-300 dark:hover:bg-gray-600/80 rounded-lg transition-colors duration-200"
                    >
                        <SparklesIcon />
                        Gadgets
                    </button>
                </div>
                 <button
                    onClick={onToggleDevTools}
                    title="Developer Tools"
                    className="flex items-center justify-center w-full px-2 py-2 text-xs font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700/60 hover:bg-gray-300 dark:hover:bg-gray-600/80 rounded-lg transition-colors duration-200"
                >
                    <DevToolIcon />
                    Dev Tools
                </button>
                 <button
                    onClick={onNewTemporaryChat}
                    className="flex items-center justify-center w-full px-4 py-2 text-xs font-semibold text-gray-800 dark:text-white bg-gray-200/80 dark:bg-gray-700/40 hover:bg-gray-300/80 dark:hover:bg-gray-600/60 rounded-lg transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.543-3.325m11.5 0A9.97 9.97 0 0122 12c-1.274 4.057-5.064 7-9.543 7a10.05 10.05 0 01-2.599-.375" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15" />
                    </svg>
                    Temporary Chat
                </button>
            </div>
            <div className="flex-grow p-2 overflow-y-auto">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Recent Chats</h2>
                {sortedChats.map(chat => (
                    <ChatHistoryItem
                        key={chat.id}
                        chat={chat}
                        isActive={chat.id === activeChatId}
                        onSelect={() => onSelectChat(chat.id)}
                        onDelete={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    />
                ))}
            </div>
            {isCuriosityMeterOpen && <CuriosityMeter stats={curiosityStats} />}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                 {user && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center overflow-hidden">
                             {user.picture ? (
                                <img src={user.picture} alt="User Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="ml-3 overflow-hidden">
                                <span className="text-sm font-medium truncate block text-gray-800 dark:text-gray-200">{user.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">{user.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <ThemeToggleButton />
                            <button onClick={onLogout} title="Logout" className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        </aside>
    );
};

export default Sidebar;
