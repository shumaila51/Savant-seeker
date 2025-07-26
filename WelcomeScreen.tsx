
import React from 'https://esm.sh/react@^19.1.0';
import { APP_NAME, EXAMPLE_PROMPTS, type ExamplePrompt } from '../constants.tsx';

interface WelcomeScreenProps {
    onNewChat: (initialPrompt?: string) => void;
}

const ExamplePromptCard: React.FC<ExamplePrompt & { onClick: () => void }> = ({ icon, title, prompt, isNew, onClick }) => (
    <div 
        onClick={onClick}
        className="relative bg-gray-100 dark:bg-[#1e1e1e] p-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700/60 cursor-pointer transition-colors duration-200 text-left"
    >
        <div className="flex items-center text-gray-700 dark:text-gray-300">
            <div className="p-2 bg-white dark:bg-gray-900/60 rounded-full">
                {icon}
            </div>
        </div>
        <h3 className="mt-3 font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{prompt}</p>
         {isNew && (
            <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
        )}
    </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNewChat }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="max-w-3xl mx-auto w-full">
                 <div className="text-center mb-12 leading-tight">
                    <span className="block text-2xl font-light tracking-[0.05em] text-gray-500 dark:text-gray-400">GOOGLE</span>
                    <span className="block text-5xl font-light tracking-[0.15em] text-gray-800 dark:text-gray-200">SAVANT</span>
                    <span className="block -mt-3 text-7xl font-black tracking-tighter text-gray-900 dark:text-white">SEEKER</span>
                </div>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXAMPLE_PROMPTS.map((item, index) => (
                        <ExamplePromptCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            prompt={item.prompt}
                            isNew={item.isNew}
                            onClick={() => onNewChat(item.prompt)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;