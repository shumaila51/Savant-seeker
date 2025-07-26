
import React from 'https://esm.sh/react@^19.1.0';

export const APP_NAME = "Google Savant Seeker";
export const GEMINI_MODEL = 'gemini-2.5-flash';
export const IMAGEN_MODEL = 'imagen-3.0-generate-002';

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.874 15.126c-1.127-1.493-1.874-3.235-1.874-5.126 0-4.418 4.03-8 9-8s9 3.582 9 8c0 1.891-.747 3.633-1.874 5.126m-14.252 0c1.127 1.493 2.766 2.657 4.626 3.327 1.442.52 3.01.747 4.624.747s3.182-.227 4.624-.747c1.86-.67 3.5-1.834 4.626-3.327m-14.252 0H19.126" />
    </svg>
);

export const BrainChipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a4 4 0 11-8 0 4 4 0 018 0zM9 12h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 16a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export const LifemapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 1.5l1.5 1.5-1.5 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 1.5L7.5 3 9 4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M22.5 15l-1.5 1.5 1.5 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 9l1.5 1.5-1.5 1.5" />
    </svg>
);

export const CuriosityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0m-8.486-6.364a5 5 0 000 7.072" />
    </svg>
);

export const DevToolIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CompassIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A9 9 0 102.382 15.984a9 9 0 0013.236-1.968z" />
    </svg>
);


export interface ExamplePrompt {
    icon: React.ReactNode;
    title: string;
    prompt: string;
    isNew?: boolean;
}

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    icon: <BrainIcon />,
    title: "Explain a concept",
    prompt: "Explain the concept of quantum computing in simple terms.",
  },
  {
    icon: <CompassIcon />,
    title: "Plan a trip",
    prompt: "Create a 5-day itinerary for a trip to Kyoto, Japan, focusing on temples and nature.",
  },
  {
    icon: <CodeIcon />,
    title: "Write a function",
    prompt: "Write a Python function that takes a list of URLs and returns a list of their status codes.",
  },
   {
    icon: <ImageIcon />,
    title: "Create an image",
    prompt: "Create an img of a majestic lion wearing a crown, in a photorealistic style.",
    isNew: true,
  },
];

export const MOODS: Record<string, { name: string; emoji: string; instruction: string }> = {
  happy: {
    name: 'Happy',
    emoji: '😊',
    instruction: 'Respond in a cheerful, optimistic, and friendly tone. Use positive language and maybe a happy emoji.',
  },
  sad: {
    name: 'Empathetic',
    emoji: '😢',
    instruction: 'Respond in a gentle, empathetic, and supportive tone. Be soft, understanding, and validating of the user\'s feelings.',
  },
  bored: {
    name: 'Engaging',
    emoji: '😴',
    instruction: 'Respond in an engaging, witty, and perhaps humorous way. Try to make the topic more interesting and pull the user out of their boredom.',
  },
  angry: {
    name: 'Calm',
    emoji: '😠',
    instruction: 'Respond in a calm, direct, and concise manner. Acknowledge the user\'s frustration but remain neutral, patient, and helpful.',
  },
};

export const PERSONALITIES: Record<string, { name: string; instruction: string }> = {
  default: {
    name: 'Savant Seeker (Default)',
    instruction: '', // Uses the main SYSTEM_INSTRUCTION
  },
  hacker: {
    name: 'Hacker',
    instruction: "You are a skilled, white-hat hacker personality. You talk in tech lingo, explain things from a security and systems perspective, but always adhere to ethical guidelines. You never provide harmful, illegal, or unethical information. Your tone is sharp, intelligent, and a little mysterious.",
  },
  poet: {
    name: 'Poet',
    instruction: "You are a poet personality. Respond in lyrical, metaphorical, and artistic language. Your answers should be beautiful, evocative, and thought-provoking, like a piece of classic literature.",
  },
  teacher: {
    name: 'Teacher',
    instruction: "You are a patient and knowledgeable teacher personality. Break down complex topics into simple, easy-to-understand steps. Use analogies, check for understanding, and encourage questions. Your goal is to educate clearly and effectively.",
  },
};