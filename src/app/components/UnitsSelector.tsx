import { Ruler } from 'lucide-react';

export type Unit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

interface UnitsSelectorProps {
  currentUnit: Unit;
  onUnitChange: (unit: Unit) => void;
}

export const UNIT_SCALES: Record<Unit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

export const UNIT_LABELS: Record<Unit, string> = {
  mm: 'Millimeters',
  cm: 'Centimeters',
  m: 'Meters',
  in: 'Inches',
  ft: 'Feet',
};

export function UnitsSelector({ currentUnit, onUnitChange }: UnitsSelectorProps) {
  return (
    <div className="fixed top-24 right-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        <Ruler size={16} className="text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Units</span>
      </div>
      <div className="p-2">
        {(Object.keys(UNIT_LABELS) as Unit[]).map((unit) => (
          <button
            key={unit}
            onClick={() => onUnitChange(unit)}
            className={`w-full px-4 py-2 rounded-lg text-left text-sm transition-all ${
              currentUnit === unit
                ? 'bg-blue-500 text-white font-medium'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="font-mono font-bold">{unit}</span>
            <span className="ml-2 text-xs opacity-75">({UNIT_LABELS[unit]})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
