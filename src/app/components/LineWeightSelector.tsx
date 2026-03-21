import { useState } from 'react';
import { Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type LineWeight = 0.13 | 0.18 | 0.25 | 0.35 | 0.5 | 0.7 | 1.0 | 1.4 | 2.0;

interface LineWeightSelectorProps {
  value: LineWeight;
  onChange: (weight: LineWeight) => void;
}

const LINE_WEIGHTS: LineWeight[] = [0.13, 0.18, 0.25, 0.35, 0.5, 0.7, 1.0, 1.4, 2.0];

export function LineWeightSelector({ value, onChange }: LineWeightSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors text-white text-sm"
        title="Line Weight"
      >
        <Minus size={16} strokeWidth={value * 2} />
        <span className="font-mono text-xs">{value}mm</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-0 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50 min-w-[200px]"
            >
              <div className="p-2">
                <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase">
                  Line Weight
                </div>
                {LINE_WEIGHTS.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => {
                      onChange(weight);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      value === weight
                        ? 'bg-green-500/20 text-green-400'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-sm">{weight} mm</span>
                    <div
                      className="flex-1 mx-3 border-t"
                      style={{
                        borderTopWidth: `${weight}px`,
                        borderColor: value === weight ? '#10b981' : '#cbd5e1',
                      }}
                    />
                  </button>
                ))}
              </div>

              <div className="px-3 py-2 bg-slate-800/50 border-t border-slate-700 text-[10px] text-slate-500 text-center">
                ISO 128 Standard Weights
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
