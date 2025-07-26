
import React from 'https://esm.sh/react@^19.1.0';
import WelcomeScreen from './WelcomeScreen.tsx';
import ChatView from './ChatView.tsx';
import PromptInput from './PromptInput.tsx';
import LifemapView from './LifemapView.tsx';
import { type Chat, Role, type LifemapEntry, type Goal } from '../types.ts';
import { PERSONALITIES } from '../constants.tsx';

interface MainContentProps {
    currentView: 'chat' | 'lifemap';
    chat: Chat | undefined;
    onSendMessage: (messageData: { content: string, imageFile?: File | null, mood: string | null }) => void;
    onNewChat: (initialPrompt?: string, imageFile?: File) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    isGenerating: boolean;
    onStopGeneration: () => void;
    onRegenerate: () => void;
    currentPersonality: string;
    onPersonalityChange: (p: string) => void;
    currentMood: string | null;
    onMoodChange: (m: string | null) => void;
    // Lifemap props
    lifemapEntries: LifemapEntry[];
    goals: Goal[];
    onAddLifemapEntry: (entry: Omit<LifemapEntry, 'id' | 'timestamp'>) => void;
    onDeleteLifemapEntry: (id: string) => void;
    onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;
    onUpdateGoal: (goal: Goal) => void;
    onDeleteGoal: (id: string) => void;
    onExportLifemap: () => void;
    onDeleteAllLifemapData: () => void;
}

const PersonalitySelector: React.FC<{
    current: string;
    onChange: (p: string) => void;
    isGenerating: boolean;
}> = ({ current, onChange, isGenerating }) => (
    <div className="relative">
        <select
            value={current}
            onChange={(e) => onChange(e.target.value)}
            disabled={isGenerating}
            className="text-sm appearance-none bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
        >
            {Object.entries(PERSONALITIES).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
);


const MainContent: React.FC<MainContentProps> = (props) => {
    const { 
        currentView, chat, onSendMessage, onNewChat, isSidebarOpen, toggleSidebar, 
        isGenerating, onStopGeneration, onRegenerate, currentPersonality, onPersonalityChange, 
        currentMood, onMoodChange 
    } = props;
    
    const handleSend = (messageData: { content: string, imageFile?: File | null, mood: string | null }) => {
        if ((!messageData.content.trim() && !messageData.imageFile) || isGenerating) {
            return;
        }
        if (chat) {
            onSendMessage(messageData);
        } else {
            onNewChat(messageData.content, messageData.imageFile || undefined);
        }
    };

    const canRegenerate = !isGenerating && chat && chat.messages.length > 0 && chat.messages[chat.messages.length - 1].role === Role.ASSISTANT && !!chat.messages[chat.messages.length - 1].content;

    const getHeaderTitle = () => {
        if (currentView === 'lifemap') {
            return "My Lifemap";
        }
        if (chat) {
            return chat.title;
        }
        return "Savant Seeker";
    };

    return (
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-[#121212] relative">
            <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-800 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                     <div className="flex items-center gap-3 overflow-hidden">
                        {chat?.isTemporary && currentView === 'chat' && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.543-3.325m11.5 0A9.97 9.97 0 0122 12c-1.274 4.057-5.064 7-9.543 7a10.05 10.05 0 01-2.599-.375" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15" />
                                </svg>
                                <span className="hidden md:inline">Temporary</span>
                            </div>
                        )}
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{getHeaderTitle()}</h2>
                    </div>
                </div>
                {currentView === 'chat' && (
                    <div className="flex items-center">
                        <PersonalitySelector current={currentPersonality} onChange={onPersonalityChange} isGenerating={isGenerating} />
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {currentView === 'lifemap' ? (
                     <LifemapView 
                        goals={props.goals}
                        entries={props.lifemapEntries}
                        onAddEntry={props.onAddLifemapEntry}
                        onDeleteEntry={props.onDeleteLifemapEntry}
                        onAddGoal={props.onAddGoal}
                        onUpdateGoal={props.onUpdateGoal}
                        onDeleteGoal={props.onDeleteGoal}
                        onExportData={props.onExportLifemap}
                        onDeleteAllData={props.onDeleteAllLifemapData}
                    />
                ) : chat ? (
                    <ChatView chat={chat} />
                ) : (
                    <WelcomeScreen onNewChat={onNewChat} />
                )}
            </div>
            
            {currentView === 'chat' && (
                <div className="w-full flex-shrink-0 px-4 pb-4 md:px-6 md:pb-6 bg-gradient-to-t from-white via-white dark:from-[#121212] dark:via-[#121212] to-transparent">
                     <div className="max-w-3xl mx-auto">
                        {canRegenerate && (
                            <div className="text-center mb-2">
                                <button 
                                    onClick={onRegenerate}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    Regenerate response
                                </button>
                            </div>
                        )}
                        <PromptInput 
                            onSend={handleSend} 
                            isLoading={isGenerating} 
                            onStop={onStopGeneration}
                            currentMood={currentMood}
                            onMoodChange={onMoodChange}
                        />
                        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Powered by Google
                        </p>
                     </div>
                </div>
            )}
        </main>
    );
};

export default MainContent;
