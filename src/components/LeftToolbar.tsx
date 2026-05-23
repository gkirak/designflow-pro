import React from 'react';
import { useDesignStore } from '@/store/designStore';
import { motion } from 'framer-motion';
import {
  Pointer,
  PenTool,
  Square,
  Circle,
  Type,
  Image,
  Brush,
  Droplet,
} from 'lucide-react';

const tools = [
  { id: 'select', icon: Pointer, label: 'Select (S)', shortcut: 'S' },
  { id: 'pen', icon: PenTool, label: 'Pen (P)', shortcut: 'P' },
  { id: 'rectangle', icon: Square, label: 'Rectangle (R)', shortcut: 'R' },
  { id: 'circle', icon: Circle, label: 'Circle (C)', shortcut: 'C' },
  { id: 'text', icon: Type, label: 'Text (T)', shortcut: 'T' },
  { id: 'image', icon: Image, label: 'Image (I)', shortcut: 'I' },
  { id: 'brush', icon: Brush, label: 'Brush (B)', shortcut: 'B' },
  { id: 'fill', icon: Droplet, label: 'Fill (F)', shortcut: 'F' },
];

const LeftToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useDesignStore();

  return (
    <div className="flex flex-col items-center py-4 gap-2 h-full">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;

        return (
          <motion.button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
            title={tool.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={20} />
          </motion.button>
        );
      })}
    </div>
  );
};

export default LeftToolbar;
