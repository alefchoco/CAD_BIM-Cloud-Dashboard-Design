import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

interface Canvas2DProps {
  activeTool: string;
}

interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curved?: boolean;
  controlX?: number;
  controlY?: number;
}

interface PDFObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'door' | 'window' | 'furniture';
  label: string;
}

export function Canvas2D({ activeTool }: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [walls, setWalls] = useState<Wall[]>([
    { x1: 100, y1: 100, x2: 400, y2: 100 },
    { x1: 400, y1: 100, x2: 400, y2: 300 },
    { x1: 400, y1: 300, x2: 100, y2: 300 },
    { x1: 100, y1: 300, x2: 100, y2: 100 },
    { x1: 250, y1: 100, x2: 250, y2: 200, curved: true, controlX: 300, controlY: 150 },
  ]);
  const [guidePoints, setGuidePoints] = useState([
    { x: 200, y: 200 },
    { x: 350, y: 250 },
  ]);
  const [sectionCuts, setSectionCuts] = useState([
    { x1: 50, y1: 150, x2: 450, y2: 150, label: 'Section A-A' },
  ]);
  const [pdfObjects, setPdfObjects] = useState<PDFObject[]>([
    { x: 150, y: 150, width: 60, height: 20, type: 'door', label: 'Door-01' },
    { x: 300, y: 120, width: 40, height: 15, type: 'window', label: 'Window-01' },
    { x: 200, y: 200, width: 80, height: 60, type: 'furniture', label: 'Table' },
  ]);

  // Track mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  // Handle click to draw lines
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'line' && activeTool !== 'curve') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isDrawing) {
      // Start drawing
      setStartPoint({ x, y });
      setIsDrawing(true);
    } else {
      // End drawing
      if (startPoint) {
        const newWall: Wall = {
          x1: startPoint.x,
          y1: startPoint.y,
          x2: x,
          y2: y,
        };

        if (activeTool === 'curve') {
          // Add control point at midpoint for curved walls
          newWall.curved = true;
          newWall.controlX = (startPoint.x + x) / 2;
          newWall.controlY = (startPoint.y + y) / 2 - 50;
        }

        setWalls([...walls, newWall]);
      }
      setIsDrawing(false);
      setStartPoint(null);
    }
  };

  // Handle adding guide points
  const handleAddGuidePoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'guide') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGuidePoints([...guidePoints, { x, y }]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'guide') {
      handleAddGuidePoint(e);
    } else {
      handleClick(e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw coordinate axes
    drawAxes(ctx, canvas.width, canvas.height);

    // Draw PDF objects
    drawPDFObjects(ctx, pdfObjects, activeTool);

    // Draw section cuts if tool is active
    if (activeTool === 'section') {
      drawSectionCuts(ctx, sectionCuts);
    }

    // Draw guide points if tool is active
    if (activeTool === 'guide') {
      drawGuidePoints(ctx, guidePoints);
    }

    // Draw walls
    drawWalls(ctx, walls, activeTool);

    // Draw preview line while drawing
    if (isDrawing && startPoint) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw start point
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [walls, guidePoints, sectionCuts, pdfObjects, activeTool, isDrawing, startPoint, mousePos]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 0.5;

    const gridSize = 20;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1.5;

    // X axis
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(80, 30);
    ctx.stroke();

    // Arrow
    ctx.beginPath();
    ctx.moveTo(80, 30);
    ctx.lineTo(75, 27);
    ctx.lineTo(75, 33);
    ctx.closePath();
    ctx.fillStyle = '#3B82F6';
    ctx.fill();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(30, 80);
    ctx.stroke();

    // Arrow
    ctx.beginPath();
    ctx.moveTo(30, 80);
    ctx.lineTo(27, 75);
    ctx.lineTo(33, 75);
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.fillStyle = '#3B82F6';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('X', 85, 35);
    ctx.fillText('Y', 35, 90);
  };

  const drawWalls = (ctx: CanvasRenderingContext2D, walls: Wall[], activeTool: string) => {
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 3;

    walls.forEach((wall) => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      
      if (wall.curved && wall.controlX && wall.controlY) {
        // Draw curved wall using quadratic curve
        ctx.quadraticCurveTo(wall.controlX, wall.controlY, wall.x2, wall.y2);
        ctx.strokeStyle = activeTool === 'curve' ? '#8B5CF6' : '#1E293B';
      } else {
        ctx.lineTo(wall.x2, wall.y2);
        ctx.strokeStyle = '#1E293B';
      }
      
      ctx.stroke();

      // Draw control points
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(wall.x1, wall.y1, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(wall.x2, wall.y2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw curve control point if exists
      if (wall.curved && wall.controlX && wall.controlY && activeTool === 'curve') {
        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.arc(wall.controlX, wall.controlY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw control lines
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(wall.x1, wall.y1);
        ctx.lineTo(wall.controlX, wall.controlY);
        ctx.lineTo(wall.x2, wall.y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  };

  const drawGuidePoints = (ctx: CanvasRenderingContext2D, points: Array<{ x: number; y: number }>) => {
    points.forEach((point, index) => {
      // Draw guide point
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw ring
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`G${index + 1}`, point.x + 15, point.y + 5);
    });
  };

  const drawSectionCuts = (
    ctx: CanvasRenderingContext2D,
    cuts: Array<{ x1: number; y1: number; x2: number; y2: number; label: string }>
  ) => {
    cuts.forEach((cut) => {
      // Draw section line
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(cut.x1, cut.y1);
      ctx.lineTo(cut.x2, cut.y2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw end markers
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(cut.x1, cut.y1, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cut.x2, cut.y2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 14px Inter, sans-serif';
      const midX = (cut.x1 + cut.x2) / 2;
      const midY = (cut.y1 + cut.y2) / 2;
      ctx.fillText(cut.label, midX, midY - 10);
    });
  };

  const drawPDFObjects = (ctx: CanvasRenderingContext2D, objects: PDFObject[], activeTool: string) => {
    const isEditing = activeTool === 'line' || activeTool === 'curve' || activeTool === 'guide';
    
    objects.forEach((obj) => {
      // Draw object rectangle
      if (obj.type === 'door') {
        ctx.fillStyle = isEditing ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)';
        ctx.strokeStyle = '#8B5CF6';
      } else if (obj.type === 'window') {
        ctx.fillStyle = isEditing ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)';
        ctx.strokeStyle = '#3B82F6';
      } else {
        ctx.fillStyle = isEditing ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.15)';
        ctx.strokeStyle = '#10B981';
      }
      
      ctx.lineWidth = 2;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);

      // Draw label
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(obj.label, obj.x + obj.width / 2, obj.y + obj.height / 2 + 4);
      
      // Draw drag handles if editing
      if (isEditing) {
        const handleSize = 6;
        ctx.fillStyle = ctx.strokeStyle;
        // Corner handles
        ctx.fillRect(obj.x - handleSize / 2, obj.y - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(obj.x + obj.width - handleSize / 2, obj.y - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(obj.x - handleSize / 2, obj.y + obj.height - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(obj.x + obj.width - handleSize / 2, obj.y + obj.height - handleSize / 2, handleSize, handleSize);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
        className="w-full h-full"
        style={{ cursor: activeTool === 'line' || activeTool === 'curve' ? 'crosshair' : activeTool === 'guide' ? 'pointer' : 'default' }}
      />
      
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
          <div className="text-[10px] text-slate-400">Ortho</div>
        </div>
      </div>

      {/* Drawing Status */}
      {isDrawing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
          Click to set end point
        </div>
      )}
    </motion.div>
  );
}