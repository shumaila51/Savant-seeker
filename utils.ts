
import { type Message, Role } from './types.ts';

export interface CuriosityStats {
    questions: number;
    deepThoughts: number;
}

export interface CuriosityLevel {
    emoji: string;
    text: string;
    score: number;
    percentage: number;
}

/**
 * This function calculates a fictional "Curiosity Level"
 * based on the number of questions asked and the number of deep thoughts shared.
 * Ported from the user-provided Python function.
 *
 * @param stats An object containing the number of questions and deep thoughts.
 * @returns A structured object with the curiosity score and display properties.
 */
export function detectHumanCuriosityLevel(stats: CuriosityStats): CuriosityLevel {
    const { questions, deepThoughts } = stats;
    
    if (questions < 0 || deepThoughts < 0) {
        return { emoji: '🤔', text: 'Invalid input', score: 0, percentage: 0 };
    }
    
    if (questions === 0 && deepThoughts === 0) {
        return { emoji: '⚪', text: 'Start chatting to measure!', score: 0, percentage: 0 };
    }

    // The formula provided by the user.
    const curiosityScore = (questions * 1.5 + deepThoughts * 2.2) / (1 + Math.abs(questions - deepThoughts));
    
    // Normalize percentage for the progress bar. Let's cap the visual at a score of 15 for a nice scale.
    const percentage = Math.min((curiosityScore / 15) * 100, 100);

    if (curiosityScore > 10) {
        return {
            emoji: '🔥',
            text: 'Ultra Curious!',
            score: curiosityScore,
            percentage
        };
    } else if (curiosityScore > 5) {
        return {
            emoji: '🙂',
            text: 'Pretty Curious!',
            score: curiosityScore,
            percentage
        };
    } else {
        return {
            emoji: '🧐',
            text: 'Mild Curiosity...',
            score: curiosityScore,
            percentage
        };
    }
}

export function calculateCuriosityStats(messages: Message[]): CuriosityStats {
    const userMessages = messages.filter(m => m.role === Role.USER && m.content);
        
    const questions = userMessages.filter(m => m.content.trim().endsWith('?')).length;
    // Heuristic for "deep thoughts": messages longer than 120 characters.
    const deepThoughts = userMessages.filter(m => m.content.length > 120).length;

    return { questions, deepThoughts };
}
