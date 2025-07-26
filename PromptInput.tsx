
import React, { useState, useRef, useEffect } from 'https://esm.sh/react@^19.1.0';
import useAutoResizeTextArea from '../hooks/useAutoResizeTextArea.ts';
import useSpeechRecognition from '../hooks/useSpeechRecognition.ts';
import { APP_NAME, MOODS } from '../constants.tsx';

interface MoodSelectorProps {
    currentMood: string | null;
    onMoodChange: (mood: string | null) => void;
    disabled: boolean;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onMoodChange, disabled }) => (
    <div className="flex items-center gap-2 px-3 pb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Mood:</span>
        {Object.entries(MOODS).map(([key, { emoji, name }]) => (
            <button
                key={key}
                type="button"
                title={name}
                disabled={disabled}
                onClick={() => onMoodChange(currentMood === key ? null : key)}
                className={`p-1.5 rounded-full text-xl transition-all duration-200 ${
                    currentMood === key ? 'bg-blue-500/20 ring-2 ring-blue-500' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {emoji}
            </button>
        ))}
    </div>
);

interface PromptInputProps {
    onSend: (messageData: { content: string, imageFile?: File | null, mood: string | null }) => void;
    isLoading: boolean;
    onStop: () => void;
    currentMood: string | null;
    onMoodChange: (mood: string | null) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSend, isLoading, onStop, currentMood, onMoodChange }) => {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useAutoResizeTextArea(textAreaRef.current, content);

    const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition({
        onTranscriptUpdate: (transcript) => {
            setContent(transcript);
        }
    });

    useEffect(() => {
        if (isLoading && isListening) {
            stopListening();
        }
    }, [isLoading, isListening, stopListening]);

    const handleSendMessage = () => {
        if ((!content.trim() && !imageFile) || isLoading) {
            return;
        }

        onSend({ content, imageFile, mood: currentMood });
        setContent('');
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };
    
    const handleMicClick = () => {
        if (isListening) {
            stopListening();
            setTimeout(() => {
                if (content.trim()) {
                     handleSendMessage();
                }
            }, 300);
        } else {
            setContent('');
            removeImage();
            startListening();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {imagePreview && (
                <div className="mb-2 p-2 bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-xl relative w-fit">
                    <img src={imagePreview} alt="Image preview" className="max-h-40 rounded-lg" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-700 dark:bg-gray-800 text-white rounded-full p-1 leading-none hover:bg-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}
            <div className="bg-gray-100 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-xl flex flex-col">
                <MoodSelector currentMood={currentMood} onMoodChange={onMoodChange} disabled={isLoading || isListening} />
                <div className="flex items-end p-2 pt-0">
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} title="Attach image" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0" disabled={isLoading || isListening}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <textarea
                        ref={textAreaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? 'Listening...' : `Message ${APP_NAME}...`}
                        className="flex-1 bg-transparent resize-none outline-none text-gray-900 dark:text-gray-200 placeholder-gray-500 px-2 max-h-48"
                        rows={1}
                        disabled={isLoading || isListening}
                    />
                     {isSupported && (
                         <button type="button" onClick={handleMicClick} title={isListening ? "Stop and send" : "Use microphone"} className={`p-2 transition-colors flex-shrink-0 ${isListening ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`} disabled={isLoading}>
                            {isListening ? 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            }
                        </button>
                     )}
                    <button
                        type={isLoading ? "button" : "submit"}
                        onClick={isLoading ? onStop : undefined}
                        disabled={!isLoading && (!content.trim() && !imageFile)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                        aria-label={isLoading ? 'Stop generating' : 'Send message'}
                    >
                        {isLoading ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16"><path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PromptInput;
