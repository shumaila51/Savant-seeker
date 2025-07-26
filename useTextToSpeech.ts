
import { useState, useEffect, useRef, useCallback } from 'https://esm.sh/react@^19.1.0';

const useTextToSpeech = (textToSpeak: string) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            console.warn("Speech Synthesis not supported in this browser.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("SpeechSynthesis Error", e);
            setIsSpeaking(false);
        };
        
        utteranceRef.current = utterance;

        return () => {
            window.speechSynthesis.cancel();
        };

    }, [textToSpeak]);

    const speak = useCallback(() => {
        if (utteranceRef.current && !isSpeaking) {
            window.speechSynthesis.cancel(); // Cancel any previous speech
            window.speechSynthesis.speak(utteranceRef.current);
        }
    }, [isSpeaking]);
    
    const cancel = useCallback(() => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
        }
    }, [isSpeaking]);

    return { isSpeaking, speak, cancel };
};

export default useTextToSpeech;
