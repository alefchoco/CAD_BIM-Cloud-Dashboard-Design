import { Minus, Edit3, Layers, Mountain, FolderOpen, Navigation, Split, Circle, Square, Type, Scissors, Ruler, Move } from 'lucide-react';

interface SidebarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
}

export function Sidebar({ activeTool, onToolSelect }: SidebarProps) {
  const tools = [
    { id: 'line', icon: Minus, label: 'Line (L)', shortcut: 'L' },
    { id: 'circle', icon: Circle, label: 'Circle (C)', shortcut: 'C' },
    { id: 'rectangle', icon: Square, label: 'Rectangle (REC)', shortcut: 'R' },
    { id: 'trim', icon: Scissors, label: 'Trim (TR)', shortcut: 'TR' },
    { id: 'text', icon: Type, label: 'Text (T)', shortcut: 'T' },
    { id: 'dimension', icon: Ruler, label: 'Dimension (DIM)', shortcut: 'DIM' },
    { id: 'move', icon: Move, label: 'Move (M)', shortcut: 'M' },
    { id: 'layers', icon: Layers, label: 'Layers (LA)', shortcut: 'LA' },
    { id: 'terrain', icon: Mountain, label: 'Terrain Data' },
    { id: 'documents', icon: FolderOpen, label: 'Documents' },
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur-lg rounded-2xl flex flex-col items-center py-3 gap-2 z-50 shadow-[0_4px_15px_rgba(0,0,0,0.15)] max-h-[calc(100vh-120px)] overflow-y-auto">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <div key={tool.id} className="relative group">
            <button
              onClick={() => onToolSelect(tool.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeTool === tool.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={tool.label}
            >
              <Icon size={18} />
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
              {tool.label}
              {tool.shortcut && (
                <span className="ml-2 text-slate-400 font-mono">({tool.shortcut})</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}