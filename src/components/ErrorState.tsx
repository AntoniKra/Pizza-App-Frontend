interface ErrorStateProps {
  message: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function ErrorState({ message, buttonLabel = "Spróbuj ponownie", onButtonClick }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
      <div className="text-red-500 mb-4 text-4xl">⚠️</div>
      <div className="text-gray-300 font-bold mb-6 text-center max-w-lg">{message}</div>
      {onButtonClick ? (
        <button 
          onClick={onButtonClick} 
          className="px-6 py-2 bg-[#FF6B6B] rounded-full text-white font-bold hover:bg-red-500 transition"
        >
          {buttonLabel}
        </button>
      ) : null}
    </div>
  );
}