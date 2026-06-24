import { AlertCircle } from "lucide-react";

interface FormAlertProps {
  message?: string | null;
  className?: string;
}

/** Błąd ogólny formularza (np. nad polami lub pod nagłówkiem) */
export function FormAlert({ message, className = "" }: FormAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm flex items-start gap-2 ${className}`}
    >
      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

/** Alias zgodny z nazwą z issue */
export const ErrorAlert = FormAlert;

interface FieldErrorProps {
  message?: string | null;
  id?: string;
}

/** Błąd przypisany do konkretnego pola */
export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1"
    >
      <AlertCircle size={12} className="flex-shrink-0" />
      {message}
    </p>
  );
}
