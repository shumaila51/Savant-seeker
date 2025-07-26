
import React from 'https://esm.sh/react@^19.1.0';
import { type CuriosityStats, detectHumanCuriosityLevel } from '../utils.ts';

interface CuriosityMeterProps {
    stats: CuriosityStats | null;
}

const CuriosityMeter: React.FC<CuriosityMeterProps> = ({ stats }) => {
    const level = detectHumanCuriosityLevel(stats || { questions: 0, deepThoughts: 0 });

    const getProgressBarColor = (percentage: number) => {
        if (percentage > 66) return 'from-red-500 to-orange-400';
        if (percentage > 33) return 'from-yellow-400 to-lime-400';
        return 'from-sky-400 to-cyan-300';
    };

    return (
        <div className="p-3 mx-2 mb-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex-shrink-0">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">
                Curiosity Meter
            </h3>
            <div className="text-center mb-2">
                <span className="text-3xl" role="img" aria-label="curiosity-emoji">{level.emoji}</span>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1 h-8 flex items-center justify-center">
                    {level.text}
                </p>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className={`bg-gradient-to-r ${getProgressBarColor(level.percentage)} h-2.5 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${level.percentage}%` }}
                ></div>
            </div>
            
            <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                Score: {level.score.toFixed(2)}
            </p>
        </div>
    );
};

export default CuriosityMeter;
