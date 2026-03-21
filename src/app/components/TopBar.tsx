import { Eye, Download, Users, Share2 } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  viewMode: '2d' | '3d';
  onViewModeChange: (mode: '2d' | '3d') => void;
  vrEnabled: boolean;
  onVRToggle: () => void;
  onScreenshot?: () => void;
}

// Switch component
function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) {
  return (
    <button
      onClick={onCheckedChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function TopBar({
  viewMode,
  onViewModeChange,
  vrEnabled,
  onVRToggle,
  onScreenshot,
}: TopBarProps) {
  const [downloadOpen, setDownloadOpen] = useState(false);

  const downloadFormats = [
    { format: '.DWG', label: 'AutoCAD Drawing' },
    { format: '.RVT', label: 'Revit Model' },
    { format: '.PDF', label: 'PDF Document' },
    { format: '.TIF', label: 'TIFF Image' },
    { format: '.PNG', label: 'Screenshot' },
  ];

  const handleDownload = (format: string) => {
    if (format === '.PNG' && onScreenshot) {
      onScreenshot();
    } else {
      // Simulate download
      console.log(`Downloading as ${format}`);
    }
    setDownloadOpen(false);
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      {/* View Mode Switcher */}
      <div className="bg-white/80 backdrop-blur-lg rounded-full px-2 py-2 flex items-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => onViewModeChange('2d')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            viewMode === '2d'
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2D Floor Plan
        </button>
        
        <div className="flex items-center gap-2 px-4">
          <span className="text-sm text-slate-600">VR</span>
          <Switch checked={vrEnabled} onCheckedChange={onVRToggle} />
        </div>

        <button
          onClick={() => onViewModeChange('3d')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            viewMode === '3d'
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3D Elevation
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Download Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDownloadOpen(!downloadOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-lg rounded-full text-slate-700 hover:bg-white transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/20"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Download</span>
          </button>

          {/* Dropdown Menu */}
          {downloadOpen && (
            <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-lg rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden min-w-[200px]">
              {downloadFormats.map((item) => (
                <button
                  key={item.format}
                  onClick={() => handleDownload(item.format)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-100 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {item.format}
                    </div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                  <Download size={14} className="text-slate-400 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Edit Button */}
        <button className="w-12 h-12 rounded-full bg-blue-500 shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center text-white hover:bg-blue-600 transition-all">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}