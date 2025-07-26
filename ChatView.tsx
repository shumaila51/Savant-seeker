
import React, { useRef, useEffect } from 'https://esm.sh/react@^19.1.0';
import { type Chat } from '../types.ts';
import Message from './Message.tsx';

interface ChatViewProps {
    chat: Chat;
}

const ChatView: React.FC<ChatViewProps> = ({ chat }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-32">
                <div className="max-w-3xl mx-auto w-full">
                    {chat.messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatView;
