import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Canvas2D } from '../components/Canvas2D';
import { Canvas3D } from '../components/Canvas3D';
import { VRInterface } from '../components/VRInterface';
import { BottomControls } from '../components/BottomControls';
import { NorthSymbol } from '../components/NorthSymbol';
import { AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [vrEnabled, setVREnabled] = useState(false);
  const [activeTool, setActiveTool] = useState('line');
  const [editMode, setEditMode] = useState(true);
  const [northRotation, setNorthRotation] = useState(0);

  // Keyboard shortcut for voice command (Ctrl key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.repeat) {
        // Trigger voice command animation
        const voiceBtn = document.querySelector('[data-voice-btn]');
        if (voiceBtn) {
          (voiceBtn as HTMLButtonElement).click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScreenshot = () => {
    // Simple screenshot implementation
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

      {/* North Symbol */}
      <NorthSymbol rotation={northRotation} />

      {/* Sidebar - Fixed Left Navigation */}
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />

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
            <Canvas2D key="2d" activeTool={activeTool} />
          ) : (
            <Canvas3D key="3d" />
          )}
        </AnimatePresence>
      </main>

      {/* VR Interface Overlay */}
      <VRInterface vrEnabled={vrEnabled} />

      {/* Bottom Right Controls */}
      <BottomControls editMode={editMode} onEditModeChange={setEditMode} />

      {/* Status indicator */}
      <div className="fixed bottom-6 left-20 bg-white/80 backdrop-blur-lg rounded-full px-4 py-2 text-sm text-slate-600 shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-40">
        Mode: <span className="font-medium text-slate-900">{viewMode.toUpperCase()}</span>
        {editMode && <span className="ml-2 text-blue-500">• Editing</span>}
      </div>
    </div>
  );
}