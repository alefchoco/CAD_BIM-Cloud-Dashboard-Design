import { useState } from 'react';
import { Keyboard, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function KeyboardHints() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Collapsed State - Small Button */}
      {!isExpanded ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsExpanded(true)}
          className="bg-slate-900/90 backdrop-blur-lg rounded-full p-3 text-white shadow-xl hover:bg-slate-800 transition-colors group"
          title="Show keyboard shortcuts"
        >
          <Keyboard size={20} className="group-hover:scale-110 transition-transform" />
        </motion.button>
      ) : (
        /* Expanded State - Full Panel */
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden max-w-xs border border-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Keyboard size={16} className="text-green-400" />
              <span className="font-bold text-sm text-green-400">Keyboard Shortcuts</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white"
              title="Minimize"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-3 space-y-2 text-xs">
            <ShortcutRow shortcut="Ctrl" description="Open command input" />
            <ShortcutRow shortcut="Esc" description="Cancel/Close" />
            
            <div className="h-px bg-slate-700 my-2" />
            
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Drawing</div>
            <ShortcutRow shortcut="L" description="Line tool" />
            <ShortcutRow shortcut="C" description="Circle tool" />
            <ShortcutRow shortcut="R" description="Rectangle tool" />
            <ShortcutRow shortcut="T" description="Text tool" />
            <ShortcutRow shortcut="M" description="Move tool" />
            
            <div className="h-px bg-slate-700 my-2" />
            
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Navigation</div>
            <ShortcutRow shortcut="Right-Click + Drag" description="Pan view" small />
            <ShortcutRow shortcut="Scroll" description="Zoom in/out" />
            <ShortcutRow shortcut="Z" description="Zoom extents" />
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-700 text-center">
            <span className="text-[10px] text-slate-500">
              Press <span className="text-green-400 font-mono">Ctrl</span> for more commands
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface ShortcutRowProps {
  shortcut: string;
  description: string;
  small?: boolean;
}

function ShortcutRow({ shortcut, description, small }: ShortcutRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-slate-300">
      <kbd className={`font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700 text-white whitespace-nowrap ${small ? 'text-[9px]' : 'text-[10px]'}`}>
        {shortcut}
      </kbd>
      <span className="text-slate-400 text-[11px] flex-1">{description}</span>
    </div>
  );
}
