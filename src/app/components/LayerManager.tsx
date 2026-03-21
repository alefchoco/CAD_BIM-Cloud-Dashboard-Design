import { useState } from 'react';
import { X, Eye, EyeOff, Plus, Palette, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  objects: string[]; // IDs of objects in this layer
}

interface LayerManagerProps {
  visible: boolean;
  onClose: () => void;
  layers: Layer[];
  activeLayer: string;
  onLayerChange: (layerId: string) => void;
  onLayerUpdate: (layers: Layer[]) => void;
}

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1',
  '#84CC16', '#F43F5E', '#0EA5E9', '#A855F7', '#22C55E',
];

export function LayerManager({
  visible,
  onClose,
  layers,
  activeLayer,
  onLayerChange,
  onLayerUpdate,
}: LayerManagerProps) {
  const [editingColor, setEditingColor] = useState<string | null>(null);

  const handleAddLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      color: PRESET_COLORS[layers.length % PRESET_COLORS.length],
      visible: true,
      locked: false,
      objects: [],
    };
    onLayerUpdate([...layers, newLayer]);
  };

  const toggleVisibility = (layerId: string) => {
    onLayerUpdate(
      layers.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  const toggleLock = (layerId: string) => {
    onLayerUpdate(
      layers.map((l) => (l.id === layerId ? { ...l, locked: !l.locked } : l))
    );
  };

  const updateColor = (layerId: string, color: string) => {
    onLayerUpdate(
      layers.map((l) => (l.id === layerId ? { ...l, color } : l))
    );
    setEditingColor(null);
  };

  const updateName = (layerId: string, name: string) => {
    onLayerUpdate(
      layers.map((l) => (l.id === layerId ? { ...l, name } : l))
    );
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length === 1) {
      alert('Cannot delete the last layer');
      return;
    }
    onLayerUpdate(layers.filter((l) => l.id !== layerId));
    if (activeLayer === layerId) {
      onLayerChange(layers.find((l) => l.id !== layerId)?.id || '');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Layer Manager</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Layer List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      activeLayer === layer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Swatch */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setEditingColor(editingColor === layer.id ? null : layer.id)
                          }
                          className="w-8 h-8 rounded border-2 border-slate-300 shadow-sm hover:scale-110 transition-transform"
                          style={{ backgroundColor: layer.color }}
                          title="Change color"
                        />

                        {/* Color Picker Dropdown */}
                        {editingColor === layer.id && (
                          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-10">
                            <div className="grid grid-cols-5 gap-2 mb-2">
                              {PRESET_COLORS.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => updateColor(layer.id, color)}
                                  className="w-8 h-8 rounded border-2 border-slate-300 hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <input
                              type="color"
                              value={layer.color}
                              onChange={(e) => updateColor(layer.id, e.target.value)}
                              className="w-full h-8 rounded cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Layer Name */}
                      <input
                        type="text"
                        value={layer.name}
                        onChange={(e) => updateName(layer.id, e.target.value)}
                        onClick={() => onLayerChange(layer.id)}
                        className={`flex-1 px-3 py-2 rounded border-2 font-medium transition-colors ${
                          activeLayer === layer.id
                            ? 'border-blue-500 bg-white'
                            : 'border-transparent bg-slate-50 hover:border-slate-300'
                        }`}
                      />

                      {/* Object Count */}
                      <span className="text-sm text-slate-500 min-w-[60px]">
                        {layer.objects.length} obj
                      </span>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisibility(layer.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            layer.visible
                              ? 'text-slate-700 hover:bg-slate-100'
                              : 'text-slate-300 hover:bg-slate-100'
                          }`}
                          title={layer.visible ? 'Hide layer' : 'Show layer'}
                        >
                          {layer.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>

                        <button
                          onClick={() => toggleLock(layer.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            layer.locked
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                        >
                          {layer.locked ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>

                        {layers.length > 1 && (
                          <button
                            onClick={() => deleteLayer(layer.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete layer"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Layer Button */}
              <button
                onClick={handleAddLayer}
                className="w-full mt-4 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span className="font-medium">Add New Layer</span>
              </button>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <div className="text-sm text-slate-600">
                Active: <span className="font-medium text-slate-900">{layers.find(l => l.id === activeLayer)?.name}</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
