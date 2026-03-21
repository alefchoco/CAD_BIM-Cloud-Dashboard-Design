import { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandInputProps {
  onCommand: (command: string, args?: string[]) => void;
  visible: boolean;
  onClose: () => void;
  prompt?: string;
}

export function CommandInput({ onCommand, visible, onClose, prompt }: CommandInputProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // AutoCAD command aliases
  const commandAliases: Record<string, string> = {
    'L': 'LINE',
    'C': 'CIRCLE',
    'REC': 'RECTANGLE',
    'R': 'RECTANGLE',
    'TR': 'TRIM',
    'M': 'MOVE',
    'CO': 'COPY',
    'O': 'OFFSET',
    'E': 'ERASE',
    'EX': 'EXTEND',
    'F': 'FILLET',
    'CHA': 'CHAMFER',
    'SC': 'SCALE',
    'RO': 'ROTATE',
    'MI': 'MIRROR',
    'AR': 'ARRAY',
    'T': 'TEXT',
    'DI': 'DISTANCE',
    'DIM': 'DIMENSION',
    'LA': 'LAYER',
    'Z': 'ZOOM',
    'P': 'PAN',
    'U': 'UNDO',
    'REDO': 'REDO',
    'EXT': 'EXTRUDE',
    'REV': 'REVOLVE',
    'UN': 'UNITS',
  };

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parts = input.trim().toUpperCase().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    // Resolve alias to full command
    const fullCommand = commandAliases[cmd] || cmd;

    setHistory([...history, input]);
    setHistoryIndex(-1);
    onCommand(fullCommand, args);
    setInput('');
    
    if (!prompt) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100]"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-slate-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700 overflow-hidden min-w-[400px]">
              {/* Header */}
              <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                <Terminal size={16} className="text-green-400" />
                <span className="text-xs text-slate-400 font-mono">
                  {prompt || 'Command:'}
                </span>
              </div>

              {/* Input */}
              <div className="p-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-green-400 font-mono text-sm outline-none placeholder-slate-600"
                  placeholder={prompt ? "Enter value..." : "Type command (L=Line, C=Circle, REC=Rectangle, TR=Trim...)"}
                  autoComplete="off"
                />
              </div>

              {/* Help Text */}
              {!prompt && (
                <div className="px-4 pb-3 text-xs text-slate-500 font-mono">
                  Press Enter to execute • Esc to cancel • ↑↓ for history
                </div>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
