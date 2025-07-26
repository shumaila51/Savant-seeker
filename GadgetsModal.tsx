
import React, { useState } from 'https://esm.sh/react@^19.1.0';
import Modal from './Modal.tsx';
import * as Gadgets from '../utils/gadgets.ts';

interface GadgetsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Gadget {
    id: string;
    title: string;
    description: string;
    action: (input: string) => string;
    inputPlaceholder?: string;
    noInput?: boolean;
    buttonText?: string;
}

const gadgetList: Gadget[] = [
    { id: 'moodColor', title: 'Mood-to-Color', description: 'Enter a mood to see its corresponding color.', action: Gadgets.moodToColor, inputPlaceholder: 'e.g., happy, sad, calm' },
    { id: 'reverseMotivation', title: 'Reverse Motivation', description: 'Get a reverse-psychology motivational quote.', action: Gadgets.getReverseMotivation, noInput: true, buttonText: 'Motivate Me' },
    { id: 'alienTranslator', title: 'Alien Translator', description: 'Convert text to an alien-style language.', action: Gadgets.toAlienLanguage, inputPlaceholder: 'Enter any text' },
    { id: 'emojiWeather', title: 'Emoji Weather', description: 'Get a random, emoji-based weather forecast.', action: Gadgets.getEmojiWeather, noInput: true, buttonText: 'Get Forecast' },
    { id: 'procrastinationTimer', title: 'Procrastination Timer', description: 'Predicts how long you will delay a task.', action: Gadgets.getProcrastinationTime, inputPlaceholder: 'e.g., homework, cleaning' },
    { id: 'dreamInterpreter', title: 'Dream Interpreter', description: 'Gives a fake interpretation of a dream.', action: Gadgets.interpretDream, inputPlaceholder: 'e.g., snake, water, flying' },
    { id: 'smashTranslator', title: 'Keyboard Smash Translator', description: 'Converts nonsense into a fake meaning.', action: Gadgets.translateKeyboardSmash, inputPlaceholder: 'e.g., asdkfjas' },
    { id: 'nameVibe', title: 'Name Vibe Checker', description: 'Gives a "vibe" based on a person\'s name.', action: Gadgets.getNameVibe, inputPlaceholder: 'Enter a name' },
    { id: 'petTalk', title: 'Pet Talk Translator', description: 'Pretends to translate pet sounds into English.', action: Gadgets.translatePetTalk, inputPlaceholder: 'e.g., meow, bark, chirp' },
];

const GadgetCard: React.FC<Gadget> = ({ title, description, action, inputPlaceholder, noInput = false, buttonText = "Generate" }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleAction = () => {
        if (!noInput && !input.trim()) {
            setOutput('Please enter a value.');
            return;
        };
        const result = action(input);
        setOutput(result);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAction();
        }
    };
    
    return (
        <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-grow">{description}</p>
            <div className="mt-4 flex flex-col gap-3">
                {!noInput && (
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={inputPlaceholder}
                        className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
                <button
                    onClick={handleAction}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                    {buttonText}
                </button>
            </div>
            {output && (
                 <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-900/70 rounded-md transition-all animate-in fade-in duration-300">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">{output}</p>
                </div>
            )}
        </div>
    );
};

const GadgetsModal: React.FC<GadgetsModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full bg-white dark:bg-[#121212]">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Fun Gadgets</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A collection of creative and playful tools to experiment with.</p>
                </div>
                 <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gadgetList.map(gadget => (
                            <GadgetCard key={gadget.id} {...gadget} />
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default GadgetsModal;
