import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Canvas2DAdvanced } from '../components/Canvas2DAdvanced';
import { Canvas3D } from '../components/Canvas3D';
import { VRInterface } from '../components/VRInterface';
import { BottomControls } from '../components/BottomControls';
import { NorthSymbolCollapsible } from '../components/NorthSymbolCollapsible';
import { CommandInput } from '../components/CommandInput';
import { LayerManager, type Layer } from '../components/LayerManager';
import { UnitsSelector, type Unit } from '../components/UnitsSelector';
import { KeyboardHints } from '../components/KeyboardHints';
import { LineWeightSelector, type LineWeight } from '../components/LineWeightSelector';
import { BooleanOperations, type BooleanOperation } from '../components/BooleanOperations';
import { FillSettings } from '../components/FillSettings';
import { AdvancedControls } from '../components/AdvancedControls';
import { AnimatePresence } from 'motion/react';

export default function DashboardAdvanced() {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [vrEnabled, setVREnabled] = useState(false);
  const [activeTool, setActiveTool] = useState('line');
  const [editMode, setEditMode] = useState(true);
  const [northRotation, setNorthRotation] = useState(0);
  
  // Command system
  const [commandVisible, setCommandVisible] = useState(false);
  const [commandPrompt, setCommandPrompt] = useState('');
  const [commandCallback, setCommandCallback] = useState<((value: string) => void) | null>(null);
  
  // Layer system
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'layer-0',
      name: 'Layer 0',
      color: '#3B82F6',
      visible: true,
      locked: false,
      objects: [],
    },
    {
      id: 'layer-walls',
      name: 'Walls',
      color: '#EF4444',
      visible: true,
      locked: false,
      objects: [],
    },
    {
      id: 'layer-dimensions',
      name: 'Dimensions',
      color: '#10B981',
      visible: true,
      locked: false,
      objects: [],
    },
  ]);
  const [activeLayer, setActiveLayer] = useState('layer-0');
  const [showLayerManager, setShowLayerManager] = useState(false);
  
  // New advanced settings
  const [lineWeight, setLineWeight] = useState<LineWeight>(0.35);
  const [fillEnabled, setFillEnabled] = useState(false);
  const [fillOpacity, setFillOpacity] = useState(0.2);
  const [showFillOnExport, setShowFillOnExport] = useState(false);
  const [booleanOperation, setBooleanOperation] = useState<BooleanOperation | null>(null);

  // Units system
  const [currentUnit, setCurrentUnit] = useState<Unit>('m');
  const [showUnitsSelector, setShowUnitsSelector] = useState(false);

  // Uploaded files from Home page
  const uploadedFiles = (location.state as any)?.uploadedFiles || [];

  // Keyboard shortcuts for commands (Ctrl key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + any key = open command input
      if (e.ctrlKey && !e.repeat && !commandVisible) {
        setCommandVisible(true);
        e.preventDefault();
        return;
      }

      // Escape = close command
      if (e.key === 'Escape' && commandVisible) {
        setCommandVisible(false);
        setCommandPrompt('');
        setCommandCallback(null);
      }

      // Direct shortcuts (when not typing in command)
      if (!commandVisible) {
        const key = e.key.toUpperCase();
        
        // AutoCAD-style shortcuts
        const shortcuts: Record<string, string> = {
          'L': 'line',
          'C': 'circle',
          'R': 'rectangle',
          'T': 'text',
          'M': 'move',
        };

        if (shortcuts[key]) {
          setActiveTool(shortcuts[key]);
          e.preventDefault();
        }

        // U = Undo
        if (key === 'U' && e.ctrlKey) {
          // TODO: Implement undo
          e.preventDefault();
        }

        // Z = Zoom extents
        if (key === 'Z' && !e.ctrlKey) {
          // TODO: Implement zoom
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandVisible]);

  // Handle command execution
  const handleCommand = useCallback((command: string, args?: string[]) => {
    console.log('Command:', command, 'Args:', args);

    // If there's a pending callback (for measurement input), execute it
    if (commandCallback && args && args.length > 0) {
      commandCallback(args[0]);
      setCommandCallback(null);
      setCommandPrompt('');
      setCommandVisible(false);
      return;
    }

    // Standard commands
    switch (command) {
      case 'LINE':
      case 'L':
        setActiveTool('line');
        setCommandVisible(false);
        break;
      case 'CIRCLE':
      case 'C':
        setActiveTool('circle');
        setCommandVisible(false);
        break;
      case 'RECTANGLE':
      case 'REC':
      case 'R':
        setActiveTool('rectangle');
        setCommandVisible(false);
        break;
      case 'TRIM':
      case 'TR':
        setActiveTool('trim');
        setCommandVisible(false);
        break;
      case 'TEXT':
      case 'T':
        setActiveTool('text');
        setCommandVisible(false);
        break;
      case 'DIMENSION':
      case 'DIM':
        setActiveTool('dimension');
        setCommandVisible(false);
        break;
      case 'MOVE':
      case 'M':
        setActiveTool('move');
        setCommandVisible(false);
        break;
      case 'LAYER':
      case 'LA':
        setShowLayerManager(true);
        setCommandVisible(false);
        break;
      case 'UNITS':
      case 'UN':
        setShowUnitsSelector(!showUnitsSelector);
        setCommandVisible(false);
        break;
      case 'ZOOM':
      case 'Z':
        // TODO: Implement zoom extents
        setCommandVisible(false);
        break;
      case 'ERASE':
      case 'E':
        setActiveTool('erase');
        setCommandVisible(false);
        break;
      case 'EXTRUDE':
      case 'EXT':
        // TODO: Implement 3D extrusion
        setViewMode('3d');
        setCommandVisible(false);
        break;
      default:
        console.log('Unknown command:', command);
    }
  }, [commandCallback, showUnitsSelector]);

  // Provide command prompt callback
  const handleCommandPromptRequest = useCallback(
    (prompt: string, callback: (value: string) => void) => {
      setCommandPrompt(prompt);
      setCommandCallback(() => callback);
      setCommandVisible(true);
    },
    []
  );

  // Handle tool selection from sidebar
  const handleToolSelect = useCallback((tool: string) => {
    if (tool === 'layers') {
      setShowLayerManager(true);
    } else {
      setActiveTool(tool);
    }
  }, []);

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `cad-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F5F5F7] relative">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-lg rounded-full px-4 py-2 flex items-center gap-2 text-slate-700 hover:bg-white transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Home</span>
      </button>

      {/* North Symbol - Collapsible */}
      <NorthSymbolCollapsible rotation={northRotation} />

      {/* Units Selector */}
      {showUnitsSelector && (
        <UnitsSelector currentUnit={currentUnit} onUnitChange={setCurrentUnit} />
      )}

      {/* Sidebar - Fixed Left Navigation */}
      <Sidebar activeTool={activeTool} onToolSelect={handleToolSelect} />

      {/* Top Bar - Floating Center Controls */}
      <TopBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        vrEnabled={vrEnabled}
        onVRToggle={setVREnabled}
        onScreenshot={handleScreenshot}
      />

      {/* Main Workspace Canvas */}
      <main className="w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === '2d' ? (
            <Canvas2DAdvanced
              key="2d"
              activeTool={activeTool}
              layers={layers}
              activeLayer={activeLayer}
              currentUnit={currentUnit}
              lineWeight={lineWeight}
              fillEnabled={fillEnabled}
              fillOpacity={fillOpacity}
              showFillOnExport={showFillOnExport}
              booleanOperation={booleanOperation}
              onCommandPrompt={handleCommandPromptRequest}
              uploadedFiles={uploadedFiles}
            />
          ) : (
            <Canvas3D key="3d" />
          )}
        </AnimatePresence>
      </main>

      {/* VR Interface Overlay */}
      <VRInterface vrEnabled={vrEnabled} />

      {/* Bottom Right Controls */}
      <BottomControls editMode={editMode} onEditModeChange={setEditMode} />

      {/* Command Input */}
      <CommandInput
        visible={commandVisible}
        onCommand={handleCommand}
        onClose={() => {
          setCommandVisible(false);
          setCommandPrompt('');
          setCommandCallback(null);
        }}
        prompt={commandPrompt}
      />

      {/* Layer Manager Modal */}
      <LayerManager
        visible={showLayerManager}
        onClose={() => setShowLayerManager(false)}
        layers={layers}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        onLayerUpdate={setLayers}
      />

      {/* Status indicator */}
      <div className="fixed bottom-6 left-20 bg-white/90 backdrop-blur-lg rounded-full px-4 py-2 text-sm text-slate-600 shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-40 flex items-center gap-3">
        <div>
          Mode: <span className="font-medium text-slate-900">{viewMode.toUpperCase()}</span>
        </div>
        <div className="w-px h-4 bg-slate-300" />
        <div>
          Tool: <span className="font-medium text-blue-600">{activeTool.toUpperCase()}</span>
        </div>
        <div className="w-px h-4 bg-slate-300" />
        <div>
          Layer: <span className="font-medium" style={{ color: layers.find(l => l.id === activeLayer)?.color }}>
            {layers.find(l => l.id === activeLayer)?.name}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-300" />
        <div>
          Units: <span className="font-medium text-slate-900 font-mono">{currentUnit}</span>
        </div>
        {editMode && <span className="text-blue-500">• Editing</span>}
      </div>

      {/* Keyboard Hints */}
      <KeyboardHints />

      {/* Advanced Controls Panel */}
      <AdvancedControls
        lineWeight={lineWeight}
        onLineWeightChange={setLineWeight}
        fillEnabled={fillEnabled}
        fillOpacity={fillOpacity}
        showFillOnExport={showFillOnExport}
        onToggleFill={() => setFillEnabled(!fillEnabled)}
        onOpacityChange={setFillOpacity}
        onToggleExportFill={() => setShowFillOnExport(!showFillOnExport)}
        booleanOperation={booleanOperation}
        onBooleanOperationSelect={setBooleanOperation}
      />

      {/* Units Toggle Button */}
      <button
        onClick={() => setShowUnitsSelector(!showUnitsSelector)}
        className="fixed top-24 right-6 bg-white/90 backdrop-blur-lg rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white transition-all shadow-lg border border-slate-200 z-40"
      >
        📏 {currentUnit}
      </button>
    </div>
  );
}