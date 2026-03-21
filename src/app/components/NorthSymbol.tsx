import { motion } from 'motion/react';
import { Navigation } from 'lucide-react';

interface NorthSymbolProps {
  rotation?: number;
}

export function NorthSymbol({ rotation = 0 }: NorthSymbolProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-6 right-6 z-50"
    >
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-slate-200">
        {/* North Arrow */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="relative w-16 h-16 flex items-center justify-center"
        >
          {/* Compass Circle */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-300" />
          
          {/* Cardinal Points */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-xs font-bold text-red-500">
              N
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-xs font-medium text-slate-400">
              S
            </div>
            <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 text-xs font-medium text-slate-400">
              E
            </div>
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 text-xs font-medium text-slate-400">
              W
            </div>
          </div>

          {/* North Arrow Icon */}
          <motion.div
            className="relative z-10"
            animate={{ rotate: rotation }}
          >
            <Navigation
              size={32}
              className="text-red-500 fill-red-500"
              style={{ transform: 'rotate(-45deg)' }}
            />
          </motion.div>
        </motion.div>

        {/* Rotation Display */}
        <div className="mt-2 text-center text-xs text-slate-600 font-medium">
          {rotation.toFixed(0)}°
        </div>
      </div>
    </motion.div>
  );
}
