
import React, { useState } from 'https://esm.sh/react@^19.1.0';
import Modal from './Modal.tsx';

interface CodeBlockProps {
    language: string;
    value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const isHtml = language.toLowerCase() === 'html';

    return (
        <>
            <div className="bg-gray-50 dark:bg-black/70 rounded-md my-4 relative">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-t-md">
                    <span className="text-xs text-gray-600 dark:text-gray-400 lowercase">{language}</span>
                    <div className="flex items-center gap-4">
                        {isHtml && (
                            <button
                                onClick={() => setShowPreview(true)}
                                className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Preview
                            </button>
                        )}
                        <button
                            onClick={handleCopy}
                            className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            {isCopied ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    Copy code
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <pre className="p-4 text-sm overflow-x-auto text-gray-800 dark:text-white">
                    <code>{value}</code>
                </pre>
            </div>
            {isHtml && (
                <Modal isOpen={showPreview} onClose={() => setShowPreview(false)}>
                    <div className="w-full h-full bg-white">
                        <iframe
                            srcDoc={value}
                            title="HTML Preview"
                            className="w-full h-full border-none"
                            sandbox="allow-scripts"
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default CodeBlock;
