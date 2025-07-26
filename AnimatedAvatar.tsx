
import React from 'https://esm.sh/react@^19.1.0';

interface AnimatedAvatarProps {
    isSpeaking: boolean;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ isSpeaking }) => {
    return (
        <div className={`w-full h-full p-0.5 transition-transform duration-200 ${isSpeaking ? 'scale-110' : ''}`}>
            <style>
                {`
                @keyframes speakAnimation {
                    0% {
                        transform: scaleY(0.2);
                    }
                    50% {
                        transform: scaleY(1);
                    }
                    100% {
                        transform: scaleY(0.2);
                    }
                }
                .avatar-speaking .mouth-line {
                    animation: speakAnimation 0.7s infinite;
                    transform-origin: center;
                }
                `}
            </style>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-full h-full text-white ${isSpeaking ? 'avatar-speaking' : ''}`}
                aria-hidden="true"
            >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="currentColor" fillOpacity="0.1" />
                <path d="M8 10h.01" />
                <path d="M16 10h.01" />
                <path d="M9 16h6" className="mouth-line" />
            </svg>
        </div>
    );
};

export default AnimatedAvatar;
