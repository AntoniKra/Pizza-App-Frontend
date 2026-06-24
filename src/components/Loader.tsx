import type { ReactNode } from "react";

type LoaderProps = {
  message?: string;
  size?: number;
  inline?: boolean;
  className?: string;
  icon?: ReactNode;
};

export default function Loader({
  message,
  size = 48,
  inline = false,
  className = "",
}: LoaderProps) {
  const wrapperClass = inline
    ? `flex items-center justify-center gap-3 ${className}`
    : `min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white ${className}`;

  return (
    <div className={wrapperClass}>
      <div
        className="rounded-full border-[#FF6B6B] border-t-transparent animate-spin"
        style={{ width: size, height: size, borderWidth: Math.max(3, size / 12) }}
      />
      {message ? (
        <div className={inline ? "text-sm text-gray-400" : "text-gray-400 font-medium animate-pulse text-center max-w-lg"}>
          {message}
        </div>
      ) : null}
    </div>
  );
}