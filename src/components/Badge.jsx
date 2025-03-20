export function Badge({ status, text }) {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'info':
                // Never tested colors
                return 'bg-blue-300/30 text-blue-400 dark:bg-blue-400/10 dark:text-blue-400';
            case 'warning':
                return 'bg-orange-300/30 text-orange-400 dark:bg-yellow-600/10 dark:text-yellow-600';
            case 'error':
                // Never tested colors
                return 'bg-red-300/30 text-red-400 dark:bg-red-400/10 dark:text-red-400';
            case 'cloud-only':
                return 'bg-orange-200/50 text-orange-400 dark:bg-orange-600/20 dark:text-orange-400';
            case 'experimental':
                return 'bg-teal-200/50 text-teal-400 dark:bg-teal-500/15 dark:text-teal-400';
            default:
                return 'bg-gray-500/30 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400';
        }
    };

    const baseStyle = 'rounded-md py-0.5 px-2 text-sm';

    const statusStyle = getStatusStyles(status);

    return <span className={`${baseStyle} ${statusStyle}`}>{text}</span>;
}
