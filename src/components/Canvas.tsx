import React, { useRef, useEffect, useState } from 'react';
import { useDesignStore } from '../store/designStore';
import { motion } from 'framer-motion';
import '../styles/Canvas.css';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useDesignStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw objects
    if (store.project) {
      const currentPage = store.project.pages.find(
        (p) => p.id === store.project!.currentPageId
      );
      if (currentPage) {
        currentPage.objects.forEach((obj) => {
          drawObject(ctx, obj, store.zoom, store.panX, store.panY, store.selectedObjectId === obj.id);
        });
      }
    }
  }, [store.project, store.zoom, store.panX, store.panY, store.selectedObjectId]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawObject = (
    ctx: CanvasRenderingContext2D,
    obj: any,
    zoom: number,
    panX: number,
    panY: number,
    isSelected: boolean
  ) => {
    const x = obj.x * zoom + panX;
    const y = obj.y * zoom + panY;
    const w = obj.width * zoom;
    const h = obj.height * zoom;

    ctx.save();
    ctx.globalAlpha = obj.opacity;

    // Draw shape
    ctx.fillStyle = obj.fill;
    ctx.strokeStyle = obj.stroke;
    ctx.lineWidth = obj.strokeWidth;

    if (obj.type === 'rectangle') {
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    } else if (obj.type === 'circle') {
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Draw selection box
    if (isSelected) {
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);

      // Draw handles
      const handles = [
        [x, y],
        [x + w / 2, y],
        [x + w, y],
        [x, y + h / 2],
        [x + w, y + h / 2],
        [x, y + h],
        [x + w / 2, y + h],
        [x + w, y + h],
      ];

      handles.forEach((handle) => {
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(handle[0] - 4, handle[1] - 4, 8, 8);
      });
    }

    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse - pan
      setIsDragging(true);
      setDragStart({ x: e.clientX - store.panX, y: e.clientY - store.panY });
    } else if (e.button === 0) {
      // Left mouse - create or select
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - store.panX) / store.zoom;
        const y = (e.clientY - rect.top - store.panY) / store.zoom;

        if (store.selectedTool === 'rectangle') {
          store.createObject('rectangle', x, y);
        } else if (store.selectedTool === 'circle') {
          store.createObject('circle', x, y);
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      store.setPan(e.clientX - dragStart.x, e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    store.setZoom(store.zoom * delta);
  };

  return (
    <motion.canvas
      ref={canvasRef}
      className="canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default Canvas;
