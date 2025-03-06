interface ErrorMessageProps {
    message: string | null;
    onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>{message}</span>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-red-700 hover:text-red-800 font-medium"
                >
                    Try Again
                </button>
            )}
        </div>
    );
} 