import { Mic, Eye, Edit } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface BottomControlsProps {
  editMode: boolean;
  onEditModeChange: (mode: boolean) => void;
}

export function BottomControls({ editMode, onEditModeChange }: BottomControlsProps) {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    // Simulate voice listening
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-40">
      {/* Voice Command Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-full px-4 py-3 flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
      >
        <span className="text-sm text-slate-600 font-medium">Ctrl +</span>
        <button
          onClick={handleVoiceCommand}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Mic size={18} />
        </button>
        {isListening && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-slate-600"
          >
            Listening...
          </motion.span>
        )}
      </motion.div>

      {/* Edit Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-lg rounded-full px-4 py-3 flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
      >
        <button
          onClick={() => onEditModeChange(false)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            !editMode
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye size={16} />
          View Only
        </button>
        <button
          onClick={() => onEditModeChange(true)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            editMode
              ? 'bg-blue-500 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit size={16} />
          Edit Mode
        </button>
      </motion.div>
    </div>
  );
}
