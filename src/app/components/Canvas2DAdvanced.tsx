import { motion } from 'motion/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { Layer } from './LayerManager';
import { UNIT_SCALES, type Unit } from './UnitsSelector';
import type { LineWeight } from './LineWeightSelector';
import type { BooleanOperation } from './BooleanOperations';

interface Canvas2DProps {
  activeTool: string;
  layers: Layer[];
  activeLayer: string;
  currentUnit: Unit;
  lineWeight?: LineWeight;
  fillEnabled?: boolean;
  fillOpacity?: number;
  showFillOnExport?: boolean;
  booleanOperation?: BooleanOperation | null;
  onCommandPrompt?: (prompt: string, callback: (value: string) => void) => void;
  uploadedFiles?: Array<{ file: File; preview?: string }>;
}

interface Point {
  x: number;
  y: number;
}

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  layer: string;
}

interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
  layer: string;
}

interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  layer: string;
}

interface TextObject {
  id: string;
  x: number;
  y: number;
  text: string;
  layer: string;
  size: number;
}

interface Dimension {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  layer: string;
  offset: number;
}

export function Canvas2DAdvanced({
  activeTool,
  layers,
  activeLayer,
  currentUnit,
  lineWeight = 0.35,
  fillEnabled = false,
  fillOpacity = 0.2,
  showFillOnExport = false,
  booleanOperation = null,
  onCommandPrompt,
  uploadedFiles = [],
}: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [worldMouse, setWorldMouse] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [snapPoint, setSnapPoint] = useState<Point | null>(null);
  
  // Drawing objects
  const [lines, setLines] = useState<Line[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [texts, setTexts] = useState<TextObject[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);

  // Camera (zoom and pan)
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Input state for measurements
  const [awaitingInput, setAwaitingInput] = useState<{
    type: 'distance' | 'angle' | 'radius';
    point: Point;
  } | null>(null);

  // Convert screen to world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      return {
        x: (screenX - camera.x) / camera.zoom,
        y: (screenY - camera.y) / camera.zoom,
      };
    },
    [camera]
  );

  // Convert world to screen coordinates
  const worldToScreen = useCallback(
    (worldX: number, worldY: number) => {
      return {
        x: worldX * camera.zoom + camera.x,
        y: worldY * camera.zoom + camera.y,
      };
    },
    [camera]
  );

  // Find nearest snap point (magnetic snap)
  const findSnapPoint = useCallback(
    (x: number, y: number, threshold = 15): Point | null => {
      const snapDistance = threshold / camera.zoom;
      let nearest: Point | null = null;
      let minDist = snapDistance;

      // Snap to line endpoints
      lines.forEach((line) => {
        const dist1 = Math.hypot(line.x1 - x, line.y1 - y);
        const dist2 = Math.hypot(line.x2 - x, line.y2 - y);
        
        if (dist1 < minDist) {
          minDist = dist1;
          nearest = { x: line.x1, y: line.y1 };
        }
        if (dist2 < minDist) {
          minDist = dist2;
          nearest = { x: line.x2, y: line.y2 };
        }

        // Snap to line midpoint
        const midX = (line.x1 + line.x2) / 2;
        const midY = (line.y1 + line.y2) / 2;
        const distMid = Math.hypot(midX - x, midY - y);
        if (distMid < minDist) {
          minDist = distMid;
          nearest = { x: midX, y: midY };
        }
      });

      // Snap to circle centers
      circles.forEach((circle) => {
        const dist = Math.hypot(circle.x - x, circle.y - y);
        if (dist < minDist) {
          minDist = dist;
          nearest = { x: circle.x, y: circle.y };
        }
      });

      // Snap to rectangle corners
      rectangles.forEach((rect) => {
        const corners = [
          { x: rect.x, y: rect.y },
          { x: rect.x + rect.width, y: rect.y },
          { x: rect.x, y: rect.y + rect.height },
          { x: rect.x + rect.width, y: rect.y + rect.height },
        ];
        corners.forEach((corner) => {
          const dist = Math.hypot(corner.x - x, corner.y - y);
          if (dist < minDist) {
            minDist = dist;
            nearest = corner;
          }
        });
      });

      return nearest;
    },
    [lines, circles, rectangles, camera.zoom]
  );

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    setMousePos({ x: screenX, y: screenY });

    const world = screenToWorld(screenX, screenY);
    setWorldMouse(world);

    // Update snap point
    const snap = findSnapPoint(world.x, world.y);
    setSnapPoint(snap);

    // Handle panning
    if (isPanning && e.buttons === 2) {
      setCamera({
        ...camera,
        x: camera.x + (screenX - panStart.x),
        y: camera.y + (screenY - panStart.y),
      });
      setPanStart({ x: screenX, y: screenY });
    }
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2) {
      // Right click - pan
      setIsPanning(true);
      setPanStart({ x: mousePos.x, y: mousePos.y });
      e.preventDefault();
      return;
    }

    if (e.button !== 0) return; // Only left click for drawing

    const world = snapPoint || worldMouse;

    // TRIM tool - delete lines on click
    if (activeTool === 'trim') {
      const threshold = 10 / camera.zoom;
      const lineToDelete = lines.find((line) => {
        const dist = distanceToLine(world.x, world.y, line);
        return dist < threshold;
      });
      if (lineToDelete) {
        setLines(lines.filter((l) => l.id !== lineToDelete.id));
      }
      return;
    }

    if (!isDrawing) {
      setStartPoint(world);
      setIsDrawing(true);

      // For tools that need dimensions, prompt for input
      if (activeTool === 'line' && onCommandPrompt) {
        onCommandPrompt('Specify distance (or click for endpoint):', (value) => {
          const distance = parseFloat(value);
          if (!isNaN(distance)) {
            // Convert from current unit to world units
            const worldDistance = distance * UNIT_SCALES[currentUnit];
            setAwaitingInput({ type: 'distance', point: world });
            
            // Prompt for angle
            onCommandPrompt('Specify angle (degrees):', (angleStr) => {
              const angle = parseFloat(angleStr);
              if (!isNaN(angle)) {
                const rad = (angle * Math.PI) / 180;
                const endPoint = {
                  x: world.x + worldDistance * Math.cos(rad),
                  y: world.y + worldDistance * Math.sin(rad),
                };
                addLine(world, endPoint);
                setIsDrawing(false);
                setStartPoint(null);
                setAwaitingInput(null);
              }
            });
          }
        });
      }
    } else {
      // Complete the shape
      if (startPoint) {
        switch (activeTool) {
          case 'line':
            if (!awaitingInput) {
              addLine(startPoint, world);
            }
            break;
          case 'circle':
            addCircle(startPoint, world);
            break;
          case 'rectangle':
            addRectangle(startPoint, world);
            break;
          case 'text':
            addText(world);
            break;
          case 'dimension':
            addDimension(startPoint, world);
            break;
        }
      }
      setIsDrawing(false);
      setStartPoint(null);
      setAwaitingInput(null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2) {
      setIsPanning(false);
    }
  };

  // Prevent context menu on right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, camera.zoom * delta));
    
    // Zoom towards mouse position
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setCamera({
      x: mouseX - (mouseX - camera.x) * (newZoom / camera.zoom),
      y: mouseY - (mouseY - camera.y) * (newZoom / camera.zoom),
      zoom: newZoom,
    });
  };

  // Helper: distance from point to line
  const distanceToLine = (px: number, py: number, line: Line): number => {
    const { x1, y1, x2, y2 } = line;
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Add objects
  const addLine = (start: Point, end: Point) => {
    setLines([
      ...lines,
      {
        id: `line-${Date.now()}`,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        layer: activeLayer,
      },
    ]);
  };

  const addCircle = (center: Point, edgePoint: Point) => {
    const radius = Math.hypot(edgePoint.x - center.x, edgePoint.y - center.y);
    setCircles([
      ...circles,
      {
        id: `circle-${Date.now()}`,
        x: center.x,
        y: center.y,
        radius,
        layer: activeLayer,
      },
    ]);
  };

  const addRectangle = (start: Point, end: Point) => {
    setRectangles([
      ...rectangles,
      {
        id: `rect-${Date.now()}`,
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
        layer: activeLayer,
      },
    ]);
  };

  const addText = (pos: Point) => {
    const text = prompt('Enter text:');
    if (text) {
      setTexts([
        ...texts,
        {
          id: `text-${Date.now()}`,
          x: pos.x,
          y: pos.y,
          text,
          layer: activeLayer,
          size: 20,
        },
      ]);
    }
  };

  const addDimension = (start: Point, end: Point) => {
    setDimensions([
      ...dimensions,
      {
        id: `dim-${Date.now()}`,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        layer: activeLayer,
        offset: 30,
      },
    ]);
  };

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw axes
    drawAxes(ctx);

    // Draw uploaded PDF/images
    drawUploadedFiles(ctx);

    // Draw all objects by layer
    const activeLayerObj = layers.find((l) => l.id === activeLayer);
    
    layers.forEach((layer) => {
      if (!layer.visible) return;

      const layerColor = layer.color;
      
      // Draw lines
      lines
        .filter((line) => line.layer === layer.id)
        .forEach((line) => drawLine(ctx, line, layerColor));

      // Draw circles
      circles
        .filter((circle) => circle.layer === layer.id)
        .forEach((circle) => drawCircle(ctx, circle, layerColor));

      // Draw rectangles
      rectangles
        .filter((rect) => rect.layer === layer.id)
        .forEach((rect) => drawRectangle(ctx, rect, layerColor));

      // Draw texts
      texts
        .filter((text) => text.layer === layer.id)
        .forEach((text) => drawText(ctx, text, layerColor));

      // Draw dimensions
      dimensions
        .filter((dim) => dim.layer === layer.id)
        .forEach((dim) => drawDimension(ctx, dim, layerColor));
    });

    // Draw preview
    if (isDrawing && startPoint) {
      const previewEnd = snapPoint || worldMouse;
      drawPreview(ctx, startPoint, previewEnd, activeLayerObj?.color || '#3B82F6');
    }

    // Draw snap indicator
    if (snapPoint && !isDrawing) {
      drawSnapIndicator(ctx, snapPoint);
    }

    ctx.restore();
  }, [
    lines,
    circles,
    rectangles,
    texts,
    dimensions,
    camera,
    isDrawing,
    startPoint,
    snapPoint,
    worldMouse,
    layers,
    activeLayer,
    activeTool,
    uploadedFiles,
  ]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 50; // World units
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1 / camera.zoom;

    const startX = Math.floor(-camera.x / camera.zoom / gridSize) * gridSize;
    const startY = Math.floor(-camera.y / camera.zoom / gridSize) * gridSize;
    const endX = startX + width / camera.zoom + gridSize;
    const endY = startY + height / camera.zoom + gridSize;

    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    const origin = screenToWorld(0, 0);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2 / camera.zoom;

    // X axis
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x + 100, 0);
    ctx.stroke();

    // Y axis  
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(0, origin.y + 100);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#3B82F6';
    ctx.font = `${14 / camera.zoom}px Inter, sans-serif`;
    ctx.fillText('X', origin.x + 110, 5);
    ctx.fillText('Y', 5, origin.y + 110);
  };

  const drawUploadedFiles = (ctx: CanvasRenderingContext2D) => {
    // Draw uploaded PDF/images in the background
    uploadedFiles.forEach((file, index) => {
      if (file.preview) {
        const img = new Image();
        img.src = file.preview;
        // Draw at offset positions
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img, index * 200, index * 200, 400, 400);
        ctx.globalAlpha = 1;
      }
    });
  };

  const drawLine = (ctx: CanvasRenderingContext2D, line: Line, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 / camera.zoom;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();

    // Draw endpoints
    const dotSize = 3 / camera.zoom;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(line.x1, line.y1, dotSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(line.x2, line.y2, dotSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, circle: Circle, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 / camera.zoom;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw center point
    ctx.fillStyle = color;
    const dotSize = 3 / camera.zoom;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, dotSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, rect: Rectangle, color: string) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color + '20';
    ctx.lineWidth = 2 / camera.zoom;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  };

  const drawText = (ctx: CanvasRenderingContext2D, text: TextObject, color: string) => {
    ctx.fillStyle = color;
    ctx.font = `${text.size / camera.zoom}px Inter, sans-serif`;
    ctx.fillText(text.text, text.x, text.y);
  };

  const drawDimension = (ctx: CanvasRenderingContext2D, dim: Dimension, color: string) => {
    const { x1, y1, x2, y2, offset } = dim;
    
    // Calculate perpendicular offset
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const perpX = (-dy / length) * offset;
    const perpY = (dx / length) * offset;

    const dimX1 = x1 + perpX;
    const dimY1 = y1 + perpY;
    const dimX2 = x2 + perpX;
    const dimY2 = y2 + perpY;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1 / camera.zoom;

    // Dimension line
    ctx.beginPath();
    ctx.moveTo(dimX1, dimY1);
    ctx.lineTo(dimX2, dimY2);
    ctx.stroke();

    // Extension lines
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(dimX1, dimY1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(dimX2, dimY2);
    ctx.stroke();

    // Arrows
    const arrowSize = 10 / camera.zoom;
    drawArrow(ctx, dimX1, dimY1, dimX2, dimY2, arrowSize);
    drawArrow(ctx, dimX2, dimY2, dimX1, dimY1, arrowSize);

    // Distance text
    const worldLength = length;
    const displayLength = worldLength / UNIT_SCALES[currentUnit];
    const midX = (dimX1 + dimX2) / 2;
    const midY = (dimY1 + dimY2) / 2;
    
    ctx.fillStyle = color;
    ctx.font = `${12 / camera.zoom}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${displayLength.toFixed(2)} ${currentUnit}`, midX, midY - 5 / camera.zoom);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    size: number
  ) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 + size * Math.cos(angle - Math.PI / 6),
      y1 + size * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 + size * Math.cos(angle + Math.PI / 6),
      y1 + size * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const drawPreview = (ctx: CanvasRenderingContext2D, start: Point, end: Point, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 / camera.zoom;
    ctx.setLineDash([10 / camera.zoom, 5 / camera.zoom]);

    if (activeTool === 'line' || activeTool === 'dimension') {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else if (activeTool === 'circle') {
      const radius = Math.hypot(end.x - start.x, end.y - start.y);
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (activeTool === 'rectangle') {
      ctx.strokeRect(
        Math.min(start.x, end.x),
        Math.min(start.y, end.y),
        Math.abs(end.x - start.x),
        Math.abs(end.y - start.y)
      );
    }

    ctx.setLineDash([]);

    // Draw start point
    ctx.fillStyle = color;
    const dotSize = 5 / camera.zoom;
    ctx.beginPath();
    ctx.arc(start.x, start.y, dotSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSnapIndicator = (ctx: CanvasRenderingContext2D, point: Point) => {
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2 / camera.zoom;
    const size = 10 / camera.zoom;

    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(point.x - size, point.y);
    ctx.lineTo(point.x + size, point.y);
    ctx.moveTo(point.x, point.y - size);
    ctx.lineTo(point.x, point.y + size);
    ctx.stroke();
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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
        className="w-full h-full"
        style={{
          cursor: activeTool === 'trim'
            ? 'not-allowed'
            : isPanning
            ? 'grabbing'
            : activeTool === 'line' ||
              activeTool === 'circle' ||
              activeTool === 'rectangle' ||
              activeTool === 'dimension'
            ? 'crosshair'
            : 'default',
        }}
      />

      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md rounded-lg px-4 py-2 text-white font-mono text-sm shadow-xl pointer-events-none z-10">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400">X:</span>{' '}
            <span className="font-medium">{(worldMouse.x / UNIT_SCALES[currentUnit]).toFixed(2)}</span>
            <span className="text-xs text-slate-500 ml-1">{currentUnit}</span>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <div>
            <span className="text-slate-400">Y:</span>{' '}
            <span className="font-medium">{(worldMouse.y / UNIT_SCALES[currentUnit]).toFixed(2)}</span>
            <span className="text-xs text-slate-500 ml-1">{currentUnit}</span>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <div className="text-xs text-slate-400">
            Zoom: {(camera.zoom * 100).toFixed(0)}%
          </div>
          {snapPoint && (
            <>
              <div className="w-px h-4 bg-slate-600" />
              <div className="text-xs text-green-400">● SNAP</div>
            </>
          )}
        </div>
      </div>

      {/* Drawing hint */}
      {isDrawing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10">
          {activeTool === 'line' && 'Click to set end point or enter distance'}
          {activeTool === 'circle' && 'Click to set radius'}
          {activeTool === 'rectangle' && 'Click to set opposite corner'}
          {activeTool === 'dimension' && 'Click to set second point'}
        </div>
      )}

      {/* Pan hint */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-600 shadow-md pointer-events-none z-10">
        <div>Right-click + Drag = Pan</div>
        <div>Scroll = Zoom</div>
        <div className="text-green-600 font-medium">Green circle = Snap point</div>
      </div>
    </motion.div>
  );
}