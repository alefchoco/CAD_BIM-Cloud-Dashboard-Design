import { LineWeightSelector, type LineWeight } from './LineWeightSelector';
import { BooleanOperations, type BooleanOperation } from './BooleanOperations';
import { FillSettings } from './FillSettings';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { useState } from 'react';

interface AdvancedControlsProps {
  lineWeight: LineWeight;
  onLineWeightChange: (weight: LineWeight) => void;
  fillEnabled: boolean;
  fillOpacity: number;
  showFillOnExport: boolean;
  onToggleFill: () => void;
  onOpacityChange: (opacity: number) => void;
  onToggleExportFill: () => void;
  booleanOperation: BooleanOperation | null;
  onBooleanOperationSelect: (operation: BooleanOperation) => void;
}

export function AdvancedControls({
  lineWeight,
  onLineWeightChange,
  fillEnabled,
  fillOpacity,
  showFillOnExport,
  onToggleFill,
  onOpacityChange,
  onToggleExportFill,
  booleanOperation,
  onBooleanOperationSelect,
}: AdvancedControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed right-6 top-48 z-40">
      {/* Collapsed State - Toggle Button */}
      {!isExpanded ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsExpanded(true)}
          className="bg-slate-900/90 backdrop-blur-lg rounded-full p-3 text-white shadow-xl hover:bg-slate-800 transition-colors group"
          title="Advanced Controls"
        >
          <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
      ) : (
        /* Expanded State - Full Panel */
        <motion.div
          initial={{ scale: 0.9, opacity: 0, x: 20 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, x: 20 }}
          className="bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-green-400" />
              <span className="font-bold text-sm text-green-400">Advanced Controls</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white text-xs"
              title="Minimize"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-w-sm">
            {/* Line Weight */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Line Weight</label>
              <LineWeightSelector
                value={lineWeight}
                onChange={onLineWeightChange}
              />
              <p className="text-[10px] text-slate-500">
                ISO 128 technical drawing standard weights
              </p>
            </div>

            <div className="h-px bg-slate-700" />

            {/* Fill Settings */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Fill & Opacity</label>
              <FillSettings
                fillEnabled={fillEnabled}
                fillOpacity={fillOpacity}
                showFillOnExport={showFillOnExport}
                onToggleFill={onToggleFill}
                onOpacityChange={onOpacityChange}
                onToggleExportFill={onToggleExportFill}
              />
              <p className="text-[10px] text-slate-500">
                Low opacity fills show overlapping areas darker
              </p>
            </div>

            <div className="h-px bg-slate-700" />

            {/* Boolean Operations */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Boolean Operations</label>
              <BooleanOperations
                onSelect={onBooleanOperationSelect}
                selectedOperation={booleanOperation}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-700 text-center">
            <span className="text-[10px] text-slate-500">
              Professional CAD controls
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
