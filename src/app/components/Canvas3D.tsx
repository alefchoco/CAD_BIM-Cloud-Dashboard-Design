import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Move, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Canvas3DProps {
  activeTool?: string;
}

export function Canvas3D({ activeTool }: Canvas3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, z: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Approximate 3D coordinates based on isometric projection
    const z = Math.sin(rotation.y) * 100;
    setMousePos({ x, y, z });

    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      setRotation((prev) => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
      }));
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw isometric grid
    drawIsometricGrid(ctx, canvas.width, canvas.height);

    // Draw 3D building
    draw3DBuilding(ctx, rotation);

    ctx.restore();
  }, [rotation, zoom]);

  const drawIsometricGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 0.5;

    const centerX = width / 2;
    const centerY = height / 2;
    const gridSize = 30;
    const rows = 20;
    const cols = 20;

    // Draw grid in isometric view
    for (let i = -rows; i <= rows; i++) {
      ctx.beginPath();
      const x1 = centerX + i * gridSize * Math.cos(Math.PI / 6);
      const y1 = centerY + i * gridSize * Math.sin(Math.PI / 6);
      const x2 = centerX + i * gridSize * Math.cos(Math.PI / 6) - cols * gridSize * Math.cos(-Math.PI / 6);
      const y2 = centerY + i * gridSize * Math.sin(Math.PI / 6) - cols * gridSize * Math.sin(-Math.PI / 6);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    for (let i = -cols; i <= cols; i++) {
      ctx.beginPath();
      const x1 = centerX + i * gridSize * Math.cos(-Math.PI / 6);
      const y1 = centerY + i * gridSize * Math.sin(-Math.PI / 6);
      const x2 = centerX + i * gridSize * Math.cos(-Math.PI / 6) + rows * gridSize * Math.cos(Math.PI / 6);
      const y2 = centerY + i * gridSize * Math.sin(-Math.PI / 6) + rows * gridSize * Math.sin(Math.PI / 6);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const draw3DBuilding = (ctx: CanvasRenderingContext2D, rotation: { x: number; y: number }) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const buildingHeight = 150;

    // Draw base (floor plan extruded)
    const base = [
      { x: -100, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 150 },
      { x: -100, y: 150 },
    ];

    // Convert to isometric with rotation
    const angle = rotation.y * (Math.PI / 180);
    const isoBase = base.map((p) => {
      // Apply rotation
      const rotX = p.x * Math.cos(angle) - p.y * Math.sin(angle);
      const rotY = p.x * Math.sin(angle) + p.y * Math.cos(angle);
      
      const isoX = (rotX - rotY) * Math.cos(Math.PI / 6);
      const isoY = (rotX + rotY) * Math.sin(Math.PI / 6);
      return { x: centerX + isoX, y: centerY + isoY };
    });

    // Draw walls
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.moveTo(isoBase[0].x, isoBase[0].y);
    for (let i = 1; i < isoBase.length; i++) {
      ctx.lineTo(isoBase[i].x, isoBase[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw vertical edges
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    isoBase.forEach((point) => {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y - buildingHeight);
      ctx.stroke();
    });

    // Draw top face
    const isoTop = isoBase.map((p) => ({ x: p.x, y: p.y - buildingHeight }));
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.moveTo(isoTop[0].x, isoTop[0].y);
    for (let i = 1; i < isoTop.length; i++) {
      ctx.lineTo(isoTop[i].x, isoTop[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw side faces
    ctx.fillStyle = '#64748B';
    
    // Right face
    ctx.beginPath();
    ctx.moveTo(isoBase[1].x, isoBase[1].y);
    ctx.lineTo(isoBase[2].x, isoBase[2].y);
    ctx.lineTo(isoTop[2].x, isoTop[2].y);
    ctx.lineTo(isoTop[1].x, isoTop[1].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Front face
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.moveTo(isoBase[0].x, isoBase[0].y);
    ctx.lineTo(isoBase[1].x, isoBase[1].y);
    ctx.lineTo(isoTop[1].x, isoTop[1].y);
    ctx.lineTo(isoTop[0].x, isoTop[0].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0, rotateX: -90 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full h-full relative"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />

      {/* 3D Controls Panel */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-slate-200">
        <div className="text-xs font-medium text-slate-600 mb-2">3D Controls</div>
        <div className="space-y-2">
          <button
            onClick={() => setRotation({ x: 0, y: 0 })}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors"
          >
            <RotateCcw size={14} />
            Reset View
          </button>
          <button
            onClick={() => setZoom(1)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors"
          >
            <Maximize2 size={14} />
            Reset Zoom
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
              className="flex-1 flex items-center justify-center px-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom((prev) => Math.max(0.5, prev * 0.8))}
              className="flex-1 flex items-center justify-center px-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
        
        {/* Zoom indicator */}
        <div className="mt-2 pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-500">Zoom: {(zoom * 100).toFixed(0)}%</div>
          <div className="text-xs text-slate-500">Rotation: {rotation.y.toFixed(0)}°</div>
        </div>
      </div>

      {/* Coordinate Display - Centered Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/70 backdrop-blur-md rounded-lg px-3 py-1.5 text-white font-mono text-xs shadow-lg pointer-events-none">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-slate-400">X:</span>{' '}
            <span className="font-medium">{mousePos.x.toFixed(1)}</span>
          </div>
          <div className="w-px h-3 bg-slate-600" />
          <div>
            <span className="text-slate-400">Y:</span>{' '}
            <span className="font-medium">{mousePos.y.toFixed(1)}</span>
          </div>
          <div className="w-px h-3 bg-slate-600" />
          <div>
            <span className="text-slate-400">Z:</span>{' '}
            <span className="font-medium">{mousePos.z.toFixed(1)}</span>
          </div>
          <div className="w-px h-3 bg-slate-600" />
          <div className="text-[10px] text-slate-400">Isometric</div>
        </div>
      </div>

      {/* Edit Instructions */}
      <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs shadow-lg">
        <div className="font-medium mb-1">3D Edit Mode</div>
        <div className="space-y-1 text-[10px] opacity-90">
          <div>• Drag to rotate view</div>
          <div>• Scroll to zoom</div>
          <div>• Click edges to select</div>
        </div>
      </div>
    </motion.div>
  );
}