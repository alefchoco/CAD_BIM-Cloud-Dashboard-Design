import { motion, AnimatePresence } from 'motion/react';
import { Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NorthSymbolProps {
  rotation?: number;
}

export function NorthSymbolCollapsible({ rotation = 0 }: NorthSymbolProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-6 right-6 z-50"
    >
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden">
        <div className="flex items-center">
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 hover:bg-slate-100 transition-colors text-slate-600"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* North Symbol Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 flex items-center gap-4">
                  {/* Compass */}
                  <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="relative w-14 h-14 flex items-center justify-center flex-shrink-0"
                  >
                    {/* Compass Circle */}
                    <div className="absolute inset-0 rounded-full border-2 border-slate-300" />

                    {/* Cardinal Points */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[10px] font-bold text-red-500">
                        N
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[10px] font-medium text-slate-400">
                        S
                      </div>
                      <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 text-[10px] font-medium text-slate-400">
                        E
                      </div>
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 text-[10px] font-medium text-slate-400">
                        W
                      </div>
                    </div>

                    {/* North Arrow Icon */}
                    <Navigation
                      size={28}
                      className="text-red-500 fill-red-500 relative z-10"
                      style={{ transform: 'rotate(-45deg)' }}
                    />
                  </motion.div>

                  {/* Info */}
                  <div className="pr-2">
                    <div className="text-xs text-slate-500 font-medium mb-1">Orientation</div>
                    <div className="text-lg font-bold text-slate-900">
                      {rotation.toFixed(0)}°
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Minimized State Info */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full right-0 mt-2 bg-slate-900/90 backdrop-blur-lg text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none"
        >
          {rotation.toFixed(0)}° North
        </motion.div>
      )}
    </motion.div>
  );
}
