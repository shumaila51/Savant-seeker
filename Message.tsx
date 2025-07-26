
import React, { useState, useEffect } from 'https://esm.sh/react@^19.1.0';
import ReactMarkdown from 'https://esm.sh/react-markdown@^10.1.0';
import remarkGfm from 'https://esm.sh/remark-gfm@^4.0.1';
import { type Message as MessageType, Role } from '../types.ts';
import CodeBlock from './CodeBlock.tsx';
import useTextToSpeech from '../hooks/useTextToSpeech.ts';
import AnimatedAvatar from './AnimatedAvatar.tsx';

interface MessageProps {
    message: MessageType;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0">
        U
    </div>
);

const AssistantIcon: React.FC<{isSpeaking: boolean}> = ({ isSpeaking }) => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
         <AnimatedAvatar isSpeaking={isSpeaking}/>
    </div>
);

const SpeakerButton = ({ isSpeaking, onToggleSpeak }: { isSpeaking: boolean, onToggleSpeak: () => void }) => (
    <button onClick={onToggleSpeak} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        {isSpeaking ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13 2.5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h10zM3 1.5a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 3 14.5h10a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13 1.5H3z"/>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                 <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
            </svg>
        )}
    </button>
);


const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.role === Role.USER;
    const [isCopied, setIsCopied] = useState(false);
    const { isSpeaking, speak, cancel } = useTextToSpeech(message.content);

    const handleCopy = () => {
        if (message.content) {
            navigator.clipboard.writeText(message.content).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };
    
    const handleToggleSpeak = () => {
        if(isSpeaking) {
            cancel();
        } else {
            speak();
        }
    }

    useEffect(() => {
        // Clean up object URLs to prevent memory leaks
        return () => {
            if (message.imageUrl && message.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(message.imageUrl);
            }
        };
    }, [message.imageUrl]);

    return (
        <div className={`group flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && <AssistantIcon isSpeaking={isSpeaking} />}
            <div className={`max-w-3xl w-full flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`relative w-full p-4 rounded-xl ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200'}`}>
                    {message.imageUrl && (
                         <div className="mb-2">
                             <img src={message.imageUrl} alt="User upload" className="max-h-60 rounded-lg" />
                         </div>
                    )}
                    {message.content === '' && !isUser && !message.generatedImages ? (
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    ) : (
                       <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-a:text-blue-400 hover:prose-a:text-blue-300">
                           <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return match ? (
                                            <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                                        ) : (
                                            <code className="bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-red-300 rounded-md px-1.5 py-0.5 font-mono text-sm" {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                     {message.generatedImages && message.generatedImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {message.generatedImages.map((imgSrc, index) => (
                                <img key={index} src={imgSrc} alt={`Generated image ${index + 1}`} className="rounded-lg max-w-full" />
                            ))}
                        </div>
                    )}
                </div>
                 <div className="mt-2 w-full flex items-center justify-between gap-4 h-6">
                    {!isUser && message.content && (
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <SpeakerButton isSpeaking={isSpeaking} onToggleSpeak={handleToggleSpeak} />
                             <button onClick={handleCopy} title="Copy message" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                {isCopied ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                            </button>
                       </div>
                    )}
                    
                    {message.groundingMetadata && message.groundingMetadata.length > 0 && (
                        <div className="mt-1 flex-1">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 px-2">Sources</h4>
                            <div className="border-t border-gray-300/50 dark:border-gray-700/50 bg-gray-200/30 dark:bg-[#1e1e1e]/50 rounded-b-lg p-2">
                                <ol className="space-y-1">
                                    {message.groundingMetadata.map((chunk) => (
                                        <li key={chunk.web.uri} className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 005.656 5.656l1.102-1.101" /></svg>
                                            <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline truncate" title={chunk.web.title}>
                                                {chunk.web.title || chunk.web.uri}
                                            </a>
                                        </li>
                                    ))}
                                 </ol>
                            </div>
                        </div>
                    )}
                 </div>
            </div>
            {isUser && <UserIcon />}
        </div>
    );
};

export default Message;
