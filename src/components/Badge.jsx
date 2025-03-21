import { useState } from 'react';

export function Badge({ status, text, hoverText }) {
    const [isHovered, setIsHovered] = useState(false);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'info':
                return 'text-blue-400';
            case 'warning':
                return 'text-yellow-600';
            case 'error':
                return 'text-red-400';
            case 'cloud-only':
                return 'text-orange-400';
            case 'experimental':
                return 'text-teal-400';
            default:
                return 'text-gray-400';
        }
    };

    const getStatusBorder = (status) => {
        switch (status) {
            case 'info':
                return 'border-blue-400';
            case 'warning':
                return 'border-yellow-600';
            case 'error':
                return 'border-red-400';
            case 'cloud-only':
                return 'border-orange-400';
            case 'experimental':
                return 'border-teal-400';
            default:
                return 'border-gray-400';
        }
    };

    const getBadgeBg = (status) => {
        switch (status) {
            case 'info':
                return 'bg-blue-300/30 dark:bg-blue-400/10';
            case 'warning':
                return 'bg-orange-300/30 dark:bg-yellow-600/10';
            case 'error':
                return 'bg-red-300/30 dark:bg-red-400/10';
            case 'cloud-only':
                return 'bg-orange-200/50 dark:bg-orange-600/20';
            case 'experimental':
                return 'bg-teal-200/50 dark:bg-teal-500/15';
            default:
                return 'bg-gray-500/30 dark:bg-gray-400/10';
        }
    };

    const baseStyle = 'relative inline-block rounded-md py-0.5 px-2 text-sm';
    const textColor = getStatusStyles(status);
    const bgColor = getBadgeBg(status);
    const borderStyle = getStatusBorder(status);

    return (
        <span
            className={`${baseStyle} ${bgColor} ${textColor}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {text}
            {hoverText && isHovered && (
                <div className={`
                    absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs p-3
                    rounded-md whitespace-pre-line
                    dark:bg-zinc-900/5 bg-white-900/5 backdrop-blur-md border ${borderStyle}
                    ${textColor} shadow-lg
                `}>
                    {hoverText}
                </div>
            )}
        </span>
    );
}