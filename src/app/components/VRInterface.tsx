import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Move, RotateCcw, ZoomIn, Hand, GripHorizontal } from 'lucide-react';
import { useState } from 'react';

interface VRInterfaceProps {
  vrEnabled: boolean;
}

export function VRInterface({ vrEnabled }: VRInterfaceProps) {
  const [gesture, setGesture] = useState<string | null>(null);

  const gestures = [
    { id: 'teleport', icon: Move, label: 'Teleport', action: 'Point & Click' },
    { id: 'grab', icon: Hand, label: 'Grab Object', action: 'Grip Trigger' },
    { id: 'rotate', icon: RotateCcw, label: 'Rotate View', action: 'Two Hands' },
    { id: 'zoom', icon: ZoomIn, label: 'Zoom', action: 'Pinch Gesture' },
  ];

  return (
    <AnimatePresence>
      {vrEnabled && (
        <>
          {/* VR Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-none z-30"
          >
            {/* VR Grid Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    'linear-gradient(#00FF00 1px, transparent 1px), linear-gradient(90deg, #00FF00 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
              />
            </div>
          </motion.div>

          {/* VR Controls Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10">
              <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                <GripHorizontal size={16} className="text-green-400" />
                VR Gestures
              </div>

              <div className="space-y-2">
                {gestures.map((gest) => {
                  const Icon = gest.icon;
                  return (
                    <motion.button
                      key={gest.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGesture(gest.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        gesture === gest.id
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Icon size={18} />
                      <div className="text-left flex-1">
                        <div className="text-xs font-medium">{gest.label}</div>
                        <div className="text-xs opacity-70">{gest.action}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* VR Teleport Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-40"
          >
            <div className="relative">
              {/* Teleport Circle */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-32 h-32 rounded-full border-4 border-green-400 bg-green-400/20"
              />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Navigation size={32} className="text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Hand Controller Indicators */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-6 bottom-6 bg-slate-800/90 backdrop-blur-lg rounded-xl p-3 z-50 border border-green-400/30"
          >
            <div className="flex items-center gap-2 text-green-400">
              <Hand size={20} />
              <div className="text-xs">
                <div className="font-bold">Left Controller</div>
                <div className="opacity-70">Move & Teleport</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-6 bottom-6 bg-slate-800/90 backdrop-blur-lg rounded-xl p-3 z-50 border border-blue-400/30"
          >
            <div className="flex items-center gap-2 text-blue-400">
              <Hand size={20} />
              <div className="text-xs">
                <div className="font-bold">Right Controller</div>
                <div className="opacity-70">Select & Interact</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}