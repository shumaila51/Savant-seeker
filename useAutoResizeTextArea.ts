
import { useEffect } from 'https://esm.sh/react@^19.1.0';

const useAutoResizeTextArea = (textAreaRef: HTMLTextAreaElement | null, value: string) => {
    useEffect(() => {
        if (textAreaRef) {
            // We need to reset the height momentarily to get the correct scrollHeight for shrinking
            textAreaRef.style.height = "auto";
            const scrollHeight = textAreaRef.scrollHeight;
            textAreaRef.style.height = `${scrollHeight}px`;
        }
    }, [textAreaRef, value]);
};

export default useAutoResizeTextArea;