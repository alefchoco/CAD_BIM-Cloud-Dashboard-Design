import { useState } from 'react';
import { Palette, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FillSettingsProps {
  fillEnabled: boolean;
  fillOpacity: number;
  showFillOnExport: boolean;
  onToggleFill: () => void;
  onOpacityChange: (opacity: number) => void;
  onToggleExportFill: () => void;
}

export function FillSettings({
  fillEnabled,
  fillOpacity,
  showFillOnExport,
  onToggleFill,
  onOpacityChange,
  onToggleExportFill,
}: FillSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 backdrop-blur-md rounded-lg border transition-colors text-sm ${
          fillEnabled
            ? 'bg-green-500/20 border-green-500 text-green-400'
            : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
        }`}
        title="Fill Settings"
      >
        <Palette size={16} />
        <span className="text-xs">Fill</span>
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
              className="absolute top-full mt-2 left-0 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50 min-w-[280px]"
            >
              <div className="p-4 space-y-4">
                {/* Title */}
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                  <Palette size={16} />
                  <span>Fill Settings</span>
                </div>

                {/* Enable/Disable Fill */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Enable Fill</span>
                  <button
                    onClick={onToggleFill}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      fillEnabled ? 'bg-green-500' : 'bg-slate-700'
                    }`}
                  >
                    <motion.div
                      animate={{ x: fillEnabled ? 24 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    />
                  </button>
                </div>

                {/* Opacity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Opacity</span>
                    <span className="text-green-400 font-mono">
                      {Math.round(fillOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fillOpacity * 100}
                    onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
                    disabled={!fillEnabled}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: fillEnabled
                        ? `linear-gradient(to right, #10b981 0%, #10b981 ${fillOpacity * 100}%, #334155 ${fillOpacity * 100}%, #334155 100%)`
                        : '#334155',
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Transparent</span>
                    <span>Opaque</span>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Preview</span>
                  <div className="relative h-16 bg-slate-800 rounded-lg overflow-hidden">
                    {/* Grid background */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(45deg, #475569 25%, transparent 25%), linear-gradient(-45deg, #475569 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #475569 75%), linear-gradient(-45deg, transparent 75%, #475569 75%)',
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                    }} />
                    
                    {/* Overlapping shapes */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded border-2 border-red-500"
                        style={{
                          backgroundColor: fillEnabled
                            ? `rgba(239, 68, 68, ${fillOpacity})`
                            : 'transparent',
                        }}
                      />
                      <div
                        className="w-12 h-12 rounded border-2 border-blue-500 -ml-6"
                        style={{
                          backgroundColor: fillEnabled
                            ? `rgba(59, 130, 246, ${fillOpacity})`
                            : 'transparent',
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">
                    Overlapping areas appear darker
                  </p>
                </div>

                {/* Export Settings */}
                <div className="pt-3 border-t border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {showFillOnExport ? (
                        <Eye size={14} className="text-green-400" />
                      ) : (
                        <EyeOff size={14} className="text-slate-500" />
                      )}
                      <span className="text-xs text-slate-300">Show on Export</span>
                    </div>
                    <button
                      onClick={onToggleExportFill}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        showFillOnExport ? 'bg-green-500' : 'bg-slate-700'
                      }`}
                    >
                      <motion.div
                        animate={{ x: showFillOnExport ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    When disabled, exports show outlines only (technical drawing style)
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
