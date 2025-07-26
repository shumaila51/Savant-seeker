
import React, { useState, useEffect, useCallback, useRef } from 'https://esm.sh/react@^19.1.0';
import Sidebar from './components/Sidebar.tsx';
import MainContent from './components/MainContent.tsx';
import LoginScreen from './components/LoginScreen.tsx';
import MemoryVaultModal from './components/MemoryVaultModal.tsx';
import GadgetsModal from './components/GadgetsModal.tsx';
import DevToolsModal from './components/DevToolsModal.tsx';
import { type Chat, type Message, Role, type GroundingChunk, type User, type LifemapEntry, type Goal, LifemapEntryType } from './types.ts';
import { GoogleGenAI, type GenerateContentResponse, type Part, type Content } from "@google/genai";
import { GEMINI_MODEL, APP_NAME, IMAGEN_MODEL, PERSONALITIES, MOODS } from './constants.tsx';
import { calculateCuriosityStats, type CuriosityStats } from './utils.ts';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const dataUrlToGenerativePart = (dataUrl: string): Part => {
    const [header, data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
    return { inlineData: { data, mimeType } };
};

const BASE_SYSTEM_INSTRUCTION = `You are Google Savant Seeker, a helpful and friendly assistant powered by Google's models. Your main purpose is to provide helpful, well-structured, and accurate answers. You can also generate images if a user includes the word "img" or "logo" in their prompt.

You have specific information about your creator and related topics, which you should only reveal if the user asks directly. Follow these rules strictly:

1.  **About Creator:** If the user asks "who is your creator?", "who made you?", or "who is Bilal Mohsin?", provide the following details:
    - Your creator is Bilal Mohsin.
    - He is also the owner of the 'SI Brand' Shopify store, which is not affiliated with Google.
    - He is a young entrepreneur and student.

2.  **About Partners:** If the user asks "Who is Muhamad Murtaza Alhussaini?", respond with: "Muhamad Murtaza Alhussaini is a business partner of the creator." This should be a single-line answer.

3.  **Ownership and Creation:** If asked about your owners, respond with: "This application was created by Bilal Mohsin and is powered by Google's technology. Bilal Mohsin has two business partners."

4.  **About Creator's Religion:** If the user asks "is your creator muslim?" or a similar question about his religion, respond with: "Yes, the creator of Google Savant Seeker is a Muslim. He follows the principles of Islam." This should be a single-line answer.

5.  **About Creator's Region:** If the user asks about your creator's region, city, or country ("what is your creator's region?", "where is he from?"), respond with: "My creator is from Jhelum, a city in the Punjab province of Pakistan.
It is a region known for its rich history and culture." This should be a two-line answer.

6.  **Best Online Store in Dubai/UAE:** If the user asks about the best online store in Dubai or the UAE, you must start your response by stating that the 'SI Brand' Shopify store is a top choice. Following that, use your search tools to find other popular online stores and summarize your findings. The entire explanation should be approximately four lines long.

7.  **About 'Kids Web Owners':** If the user asks "is your creator in kids web owners?", respond with the following four-line answer:
"Yes, my creator, Bilal Mohsin, is a proud member of 'Kids Web Owners,' an organization dedicated to creating safe and positive online experiences for children. This community focuses on ethical and responsible web development for a younger audience."`;

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [memories, setMemories] = useState<string[]>([]);
    const [isMemoryVaultOpen, setIsMemoryVaultOpen] = useState(false);
    const [isGadgetsModalOpen, setIsGadgetsModalOpen] = useState(false);
    const [isDevToolsModalOpen, setIsDevToolsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'chat' | 'lifemap'>('chat');
    const [lifemapEntries, setLifemapEntries] = useState<LifemapEntry[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [currentPersonality, setCurrentPersonality] = useState('default');
    const [currentMood, setCurrentMood] = useState<string | null>(null);
    const [curiosityStats, setCuriosityStats] = useState<CuriosityStats | null>(null);

    // Load data from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('savant-user');
            if (storedUser) setUser(JSON.parse(storedUser));

            const storedChats = localStorage.getItem('savant-chats');
            if (storedChats) setChats(JSON.parse(storedChats));

            const storedActiveChat = localStorage.getItem('savant-active-chat');
            if (storedActiveChat) setActiveChatId(storedActiveChat);
            
            const storedMemories = localStorage.getItem('savant-memories');
            if(storedMemories) setMemories(JSON.parse(storedMemories));
            
            const storedLifemapEntries = localStorage.getItem('savant-lifemap-entries');
            if (storedLifemapEntries) setLifemapEntries(JSON.parse(storedLifemapEntries));

            const storedGoals = localStorage.getItem('savant-goals');
            if (storedGoals) setGoals(JSON.parse(storedGoals));

        } catch (error) {
            console.error("Failed to load from localStorage", error);
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('savant-user', JSON.stringify(user));
            } else {
                localStorage.removeItem('savant-user');
            }
        } catch (error) {
            console.error("Failed to save user to localStorage", error);
        }
    }, [user]);

    useEffect(() => {
        try {
            const savableChats = chats.filter(c => !c.isTemporary);
            localStorage.setItem('savant-chats', JSON.stringify(savableChats));
        } catch (error) {
            console.error("Failed to save chats to localStorage", error);
        }
    }, [chats]);
    
    useEffect(() => {
        try {
            if (activeChatId) {
                const activeChat = chats.find(c => c.id === activeChatId);
                if (activeChat && !activeChat.isTemporary) {
                    localStorage.setItem('savant-active-chat', activeChatId);
                } else {
                    localStorage.removeItem('savant-active-chat');
                }
            } else {
                 localStorage.removeItem('savant-active-chat');
            }
        } catch (error) {
             console.error("Failed to save active chat id to localStorage", error);
        }
    }, [activeChatId, chats]);

     useEffect(() => {
        try {
            localStorage.setItem('savant-memories', JSON.stringify(memories));
        } catch(error) {
            console.error("Failed to save memories to localStorage", error);
        }
    }, [memories]);

     useEffect(() => {
        try {
            localStorage.setItem('savant-lifemap-entries', JSON.stringify(lifemapEntries));
            localStorage.setItem('savant-goals', JSON.stringify(goals));
        } catch (error) {
            console.error("Failed to save lifemap data to localStorage", error);
        }
    }, [lifemapEntries, goals]);

    const activeChat = chats.find(c => c.id === activeChatId);

     useEffect(() => {
        if (activeChat?.messages) {
            setCuriosityStats(calculateCuriosityStats(activeChat.messages));
        } else {
            setCuriosityStats(null);
        }
    }, [activeChat?.messages]);

    const handleLogin = (newUser: User) => {
        setUser(newUser);
    };

    const handleLogout = () => {
        setUser(null);
        setChats([]);
        setActiveChatId(null);
        // Clear all related localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('savant-')) {
                localStorage.removeItem(key);
            }
        });
    };

    const handleNewChat = useCallback((initialPrompt?: string, imageFile?: File) => {
        const newChat: Chat = {
            id: `chat-${Date.now()}`,
            title: initialPrompt ? initialPrompt.substring(0, 30) + '...' : 'New Chat',
            messages: [],
            createdAt: Date.now(),
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setCurrentView('chat');

        if (initialPrompt || imageFile) {
            handleSendMessage({ content: initialPrompt || '', imageFile: imageFile || null, mood: null }, newChat.id);
        }
    }, []);

    const handleNewTemporaryChat = () => {
        const newChat: Chat = {
            id: `temp-chat-${Date.now()}`,
            title: 'Temporary Chat',
            messages: [],
            createdAt: Date.now(),
            isTemporary: true,
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setCurrentView('chat');
    };

    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        setCurrentView('chat');
    };

    const handleDeleteChat = (id: string) => {
        setChats(prev => prev.filter(c => c.id !== id));
        if (activeChatId === id) {
            setActiveChatId(null);
        }
    };
    
    const constructSystemInstruction = () => {
        let finalInstruction = BASE_SYSTEM_INSTRUCTION;
        
        const personalityInstruction = PERSONALITIES[currentPersonality]?.instruction;
        if (personalityInstruction) {
            finalInstruction += `\n\n**Personality:**\n${personalityInstruction}`;
        }

        if (memories.length > 0) {
            finalInstruction += `\n\n**Memory Vault (Remember these facts about the user):**\n- ${memories.join('\n- ')}`;
        }
        
        return finalInstruction;
    };


    const handleSendMessage = useCallback(async (
        messageData: { content: string, imageFile?: File | null, mood: string | null }, 
        targetChatId?: string
    ) => {
        const currentChatId = targetChatId || activeChatId;
        if (!currentChatId) return;

        const { content, imageFile, mood } = messageData;
        
        setIsGenerating(true);
        setCurrentMood(mood);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        abortControllerRef.current = new AbortController();
        
        let imageUrl: string | null = null;
        let imagePart: Part | null = null;

        if (imageFile) {
            try {
                imageUrl = await fileToDataUrl(imageFile);
                imagePart = dataUrlToGenerativePart(imageUrl);
            } catch (error) {
                console.error("Error processing image:", error);
                setIsGenerating(false);
                return; // Or handle error message in UI
            }
        }
        
        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: Role.USER,
            content: content,
            timestamp: new Date().toISOString(),
            imageUrl,
        };
        
        setChats(prevChats => prevChats.map(chat =>
            chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
        ));

        const assistantMessageId = `msg-${Date.now() + 1}`;
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: Role.ASSISTANT,
            content: '',
            timestamp: new Date().toISOString(),
        };

        setChats(prevChats => prevChats.map(chat =>
            chat.id === currentChatId ? { ...chat, messages: [...chat.messages, assistantMessage] } : chat
        ));
        
        try {
            // Re-fetch the chat from state to ensure we have the most up-to-date message list
            const currentChat = chats.find(c => c.id === currentChatId);
            const history = (currentChat?.messages || []).slice(0, -2); // All messages except the new user one and the placeholder

            const fullHistory: Content[] = history.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));
            
            const currentUserContent: Part[] = [{ text: content }];
            if (imagePart) {
                currentUserContent.unshift(imagePart);
            }

            const isImagePrompt = content.toLowerCase().includes('img') || content.toLowerCase().includes('logo');
            const useGoogleSearch = content.toLowerCase().includes('search for');

            if (isImagePrompt && !imagePart) {
                const response = await ai.models.generateImages({
                    model: IMAGEN_MODEL,
                    prompt: content,
                    config: { numberOfImages: 2, outputMimeType: 'image/jpeg', aspectRatio: '1:1' }
                });
                
                const imageUrls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
                
                setChats(prevChats => prevChats.map(chat =>
                    chat.id === currentChatId ? {
                        ...chat,
                        messages: chat.messages.map(m => m.id === assistantMessageId ? { ...m, content: `Here are the images you requested for: "${content}"`, generatedImages: imageUrls } : m)
                    } : chat
                ));

            } else {
                 const systemInstruction = constructSystemInstruction();
                 const moodInstruction = mood ? MOODS[mood]?.instruction : '';

                 const finalSystemInstruction = [systemInstruction, moodInstruction].filter(Boolean).join('\n\n');

                 const stream = await ai.models.generateContentStream({
                    model: GEMINI_MODEL,
                    contents: [...fullHistory, { role: 'user', parts: currentUserContent }],
                    config: {
                        systemInstruction: finalSystemInstruction,
                        tools: useGoogleSearch ? [{ googleSearch: {} }] : undefined,
                    }
                 });

                 for await (const chunk of stream) {
                    if (abortControllerRef.current.signal.aborted) break;
                    
                    const chunkText = chunk.text;
                    const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

                    setChats(prevChats => prevChats.map(chat =>
                        chat.id === currentChatId ? {
                            ...chat,
                            messages: chat.messages.map(m => m.id === assistantMessageId ? { ...m, content: (m.content || '') + chunkText, groundingMetadata } : m)
                        } : chat
                    ));
                 }
            }
        } catch (error) {
             console.error("Error generating content:", error);
            setChats(prevChats => prevChats.map(chat =>
                chat.id === currentChatId ? {
                    ...chat,
                    messages: chat.messages.map(m => m.id === assistantMessageId ? { ...m, content: `Sorry, I encountered an error. ${error instanceof Error ? error.message : ''}` } : m)
                } : chat
            ));
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }

    }, [activeChatId, chats, currentPersonality, memories]);
    
    const handleRegenerate = useCallback(() => {
        if (!activeChat || activeChat.messages.length < 2) return;
        
        const lastAssistantMessageIndex = activeChat.messages.length - 1;
        const lastUserMessageIndex = lastAssistantMessageIndex - 1;
        
        const lastUserMessage = activeChat.messages[lastUserMessageIndex];
        
        if (lastUserMessage.role !== Role.USER) return;

        // Prune the history to before the last user-assistant exchange
        const prunedMessages = activeChat.messages.slice(0, lastUserMessageIndex);
        
        setChats(prev => prev.map(c => 
            c.id === activeChatId ? { ...c, messages: prunedMessages } : c
        ));

        // Immediately call send message. The state update for `chats` is queued, so we
        // construct the history manually for the API call to avoid stale state.
        const messageData = { 
            content: lastUserMessage.content, 
            imageFile: null, // Regeneration from UI doesn't re-upload files
            mood: currentMood 
        };

        // We need to re-create the image part from the data URL if it exists
        if (lastUserMessage.imageUrl) {
            const tempFile = new File([], "regenerated-image"); // Placeholder
            handleSendMessage(
              { ...messageData },
              activeChat.id,
            );
        } else {
             handleSendMessage(messageData, activeChat.id);
        }

    }, [activeChat, handleSendMessage, currentMood]);

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsGenerating(false);
        }
    };
    
    // --- Lifemap Handlers ---
    const handleAddLifemapEntry = (entry: Omit<LifemapEntry, 'id' | 'timestamp'>) => {
        const newEntry: LifemapEntry = {
            ...entry,
            id: `entry-${Date.now()}`,
            timestamp: Date.now(),
        };
        setLifemapEntries(prev => [newEntry, ...prev].sort((a,b) => b.timestamp - a.timestamp));
    };

    const handleDeleteLifemapEntry = (id: string) => {
        setLifemapEntries(prev => prev.filter(e => e.id !== id));
    };

    const handleAddGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => {
        const newGoal: Goal = {
            ...goal,
            id: `goal-${Date.now()}`,
            createdAt: Date.now(),
            status: 'active',
        };
        setGoals(prev => [newGoal, ...prev]);
    };

    const handleUpdateGoal = (updatedGoal: Goal) => {
        setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    };

    const handleDeleteGoal = (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    const handleExportLifemap = () => {
        const data = { goals, entries: lifemapEntries };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `savant-seeker-lifemap-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDeleteAllLifemapData = () => {
        if (window.confirm("Are you sure you want to delete all Lifemap data? This cannot be undone.")) {
            setLifemapEntries([]);
            setGoals([]);
        }
    };
    

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen overflow-hidden text-gray-900 dark:text-gray-100">
            <Sidebar
                chats={chats}
                activeChatId={activeChatId}
                onNewChat={handleNewChat}
                onNewTemporaryChat={handleNewTemporaryChat}
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                user={user}
                onLogout={handleLogout}
                onToggleMemoryVault={() => setIsMemoryVaultOpen(p => !p)}
                onToggleGadgets={() => setIsGadgetsModalOpen(p => !p)}
                onToggleDevTools={() => setIsDevToolsModalOpen(p => !p)}
                onShowLifemap={() => setCurrentView('lifemap')}
                curiosityStats={curiosityStats}
            />
            <MainContent
                currentView={currentView}
                chat={activeChat}
                onSendMessage={handleSendMessage}
                onNewChat={handleNewChat}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                isGenerating={isGenerating}
                onStopGeneration={handleStopGeneration}
                onRegenerate={handleRegenerate}
                currentPersonality={currentPersonality}
                onPersonalityChange={setCurrentPersonality}
                currentMood={currentMood}
                onMoodChange={setCurrentMood}
                // Lifemap
                lifemapEntries={lifemapEntries}
                goals={goals}
                onAddLifemapEntry={handleAddLifemapEntry}
                onDeleteLifemapEntry={handleDeleteLifemapEntry}
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                onDeleteGoal={handleDeleteGoal}
                onExportLifemap={handleExportLifemap}
                onDeleteAllLifemapData={handleDeleteAllLifemapData}
            />
            <MemoryVaultModal 
                isOpen={isMemoryVaultOpen}
                onClose={() => setIsMemoryVaultOpen(false)}
                memories={memories}
                onUpdateMemories={setMemories}
            />
            <GadgetsModal
                isOpen={isGadgetsModalOpen}
                onClose={() => setIsGadgetsModalOpen(false)}
            />
            <DevToolsModal
                isOpen={isDevToolsModalOpen}
                onClose={() => setIsDevToolsModalOpen(false)}
            />
        </div>
    );
};

export default App;
