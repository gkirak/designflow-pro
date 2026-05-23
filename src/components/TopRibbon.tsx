import React from 'react';
import { useDesignStore } from '@/store/designStore';
import { motion } from 'framer-motion';
import { FileText, Save, RotateCcw, RotateCw, Settings } from 'lucide-react';

const TopRibbon: React.FC = () => {
  const { project, undo, redo, createProject, saveProject } = useDesignStore();

  return (
    <div className="flex items-center justify-between px-4 h-full gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
          <span className="font-bold text-sm text-white">DesignFlow</span>
        </div>

        {/* File Menu */}
        <div className="flex gap-2 ml-4 border-l border-slate-700 pl-4">
          <motion.button
            onClick={() => createProject('Untitled Project')}
            className="px-3 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={14} /> New
          </motion.button>

          <motion.button
            onClick={saveProject}
            className="px-3 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save size={14} /> Save
          </motion.button>
        </div>
      </div>

      {/* Center Section - Project Info */}
      {project && (
        <div className="text-sm text-slate-300">
          <span className="font-medium">{project.name}</span>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Edit Controls */}
        <motion.button
          onClick={undo}
          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Undo (Ctrl+Z)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={14} />
        </motion.button>

        <motion.button
          onClick={redo}
          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Redo (Ctrl+Y)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCw size={14} />
        </motion.button>

        {/* Settings */}
        <motion.button
          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Settings"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={14} />
        </motion.button>
      </div>
    </div>
  );
};

export default TopRibbon;
