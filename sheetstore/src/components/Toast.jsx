import { CheckCircle2, X } from "lucide-react";

export default function Toast({ message, isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-[90%] sm:w-auto 
                    flex items-start gap-3 bg-slate-900 text-white 
                    px-5 py-4 rounded-xl shadow-2xl 
                    animate-in slide-in-from-bottom duration-300">

      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />

      <div className="flex-1 text-sm font-medium leading-relaxed">
        {message}
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
