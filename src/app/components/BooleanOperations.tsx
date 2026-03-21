import { Plus, Divide, Minus, X } from 'lucide-react';
import { motion } from 'motion/react';

export type BooleanOperation = 'union' | 'difference' | 'exclusion' | 'division';

interface BooleanOperationsProps {
  onSelect: (operation: BooleanOperation) => void;
  selectedOperation: BooleanOperation | null;
}

export function BooleanOperations({ onSelect, selectedOperation }: BooleanOperationsProps) {
  const operations = [
    {
      id: 'union' as BooleanOperation,
      icon: Plus,
      label: 'Union',
      description: 'Combine shapes',
      color: 'text-blue-400',
    },
    {
      id: 'difference' as BooleanOperation,
      icon: Minus,
      label: 'Difference',
      description: 'Subtract shape',
      color: 'text-red-400',
    },
    {
      id: 'exclusion' as BooleanOperation,
      icon: X,
      label: 'Exclusion',
      description: 'Remove overlap',
      color: 'text-yellow-400',
    },
    {
      id: 'division' as BooleanOperation,
      icon: Divide,
      label: 'Division',
      description: 'Split shapes',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-lg rounded-xl border border-slate-700 p-3">
      <div className="text-xs font-bold text-green-400 mb-3 px-1 flex items-center gap-2">
        <Plus size={14} />
        <span>Boolean Operations</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {operations.map((op) => {
          const Icon = op.icon;
          const isActive = selectedOperation === op.id;

          return (
            <motion.button
              key={op.id}
              onClick={() => onSelect(op.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-slate-700 border-green-500 shadow-lg shadow-green-500/20'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <Icon
                  size={20}
                  className={isActive ? 'text-green-400' : op.color}
                />
                <span className="text-[10px] font-medium text-white">
                  {op.label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeOperation"
                  className="absolute inset-0 border-2 border-green-400 rounded-lg"
                  transition={{ type: 'spring', duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700">
        <div className="text-[10px] text-slate-400 space-y-1">
          <p className="flex items-center gap-1">
            <span className="w-1 h-1 bg-green-400 rounded-full" />
            Select operation, then click two shapes
          </p>
          {selectedOperation && (
            <p className="text-green-400 font-medium">
              Active: {operations.find(o => o.id === selectedOperation)?.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}