import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface DesignObject {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'image' | 'path';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  imageUrl?: string;
}

export interface Page {
  id: string;
  name: string;
  objects: DesignObject[];
}

export interface Project {
  id: string;
  name: string;
  pages: Page[];
  currentPageId: string;
  createdAt: number;
  updatedAt: number;
}

interface DesignState {
  // Project State
  project: Project | null;
  projects: Project[];

  // UI State
  activeTool: string;
  selectedObjectIds: string[];
  zoomLevel: number;
  panX: number;
  panY: number;
  showGrid: boolean;

  // History
  history: Project[];
  historyIndex: number;

  // Actions
  createProject: (name: string) => void;
  createPage: () => void;
  addObject: (object: DesignObject) => void;
  updateObject: (id: string, updates: Partial<DesignObject>) => void;
  deleteObject: (id: string) => void;
  selectObjects: (ids: string[]) => void;
  setActiveTool: (tool: string) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  loadProject: (id: string) => void;

  // Computed
  currentPage: Page | null;
  selectedObjects: DesignObject[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useDesignStore = create<DesignState>()(
  devtools((set, get) => ({
    project: null,
    projects: [],
    activeTool: 'select',
    selectedObjectIds: [],
    zoomLevel: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    history: [],
    historyIndex: -1,

    createProject: (name: string) => {
      const newProject: Project = {
        id: generateId(),
        name,
        pages: [
          {
            id: generateId(),
            name: 'Page 1',
            objects: [],
          },
        ],
        currentPageId: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      newProject.currentPageId = newProject.pages[0].id;

      set((state) => ({
        project: newProject,
        projects: [...state.projects, newProject],
        history: [newProject],
        historyIndex: 0,
      }));
    },

    createPage: () => {
      set((state) => {
        if (!state.project) return state;

        const newPage: Page = {
          id: generateId(),
          name: `Page ${state.project.pages.length + 1}`,
          objects: [],
        };

        const updatedProject = {
          ...state.project,
          pages: [...state.project.pages, newPage],
          updatedAt: Date.now(),
        };

        return {
          project: updatedProject,
          history: [...state.history.slice(0, state.historyIndex + 1), updatedProject],
          historyIndex: state.historyIndex + 1,
        };
      });
    },

    addObject: (object: DesignObject) => {
      set((state) => {
        if (!state.project) return state;

        const updatedProject = {
          ...state.project,
          pages: state.project.pages.map((page) =>
            page.id === state.project!.currentPageId
              ? { ...page, objects: [...page.objects, object] }
              : page,
          ),
          updatedAt: Date.now(),
        };

        return {
          project: updatedProject,
          history: [...state.history.slice(0, state.historyIndex + 1), updatedProject],
          historyIndex: state.historyIndex + 1,
        };
      });
    },

    updateObject: (id: string, updates: Partial<DesignObject>) => {
      set((state) => {
        if (!state.project) return state;

        const updatedProject = {
          ...state.project,
          pages: state.project.pages.map((page) =>
            page.id === state.project!.currentPageId
              ? {
                  ...page,
                  objects: page.objects.map((obj) =>
                    obj.id === id ? { ...obj, ...updates } : obj,
                  ),
                }
              : page,
          ),
          updatedAt: Date.now(),
        };

        return {
          project: updatedProject,
          history: [...state.history.slice(0, state.historyIndex + 1), updatedProject],
          historyIndex: state.historyIndex + 1,
        };
      });
    },

    deleteObject: (id: string) => {
      set((state) => {
        if (!state.project) return state;

        const updatedProject = {
          ...state.project,
          pages: state.project.pages.map((page) =>
            page.id === state.project!.currentPageId
              ? { ...page, objects: page.objects.filter((obj) => obj.id !== id) }
              : page,
          ),
          updatedAt: Date.now(),
        };

        return {
          project: updatedProject,
          selectedObjectIds: state.selectedObjectIds.filter((objId) => objId !== id),
          history: [...state.history.slice(0, state.historyIndex + 1), updatedProject],
          historyIndex: state.historyIndex + 1,
        };
      });
    },

    selectObjects: (ids: string[]) => {
      set({ selectedObjectIds: ids });
    },

    setActiveTool: (tool: string) => {
      set({ activeTool: tool, selectedObjectIds: [] });
    },

    setZoom: (zoom: number) => {
      set({ zoomLevel: Math.max(0.1, Math.min(10, zoom)) });
    },

    setPan: (x: number, y: number) => {
      set({ panX: x, panY: y });
    },

    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          return {
            historyIndex: state.historyIndex - 1,
            project: state.history[state.historyIndex - 1],
          };
        }
        return state;
      });
    },

    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          return {
            historyIndex: state.historyIndex + 1,
            project: state.history[state.historyIndex + 1],
          };
        }
        return state;
      });
    },

    saveProject: () => {
      set((state) => {
        if (state.project) {
          localStorage.setItem(`project-${state.project.id}`, JSON.stringify(state.project));
        }
        return state;
      });
    },

    loadProject: (id: string) => {
      const saved = localStorage.getItem(`project-${id}`);
      if (saved) {
        const project = JSON.parse(saved);
        set({
          project,
          history: [project],
          historyIndex: 0,
        });
      }
    },

    get currentPage() {
      const state = get();
      if (!state.project) return null;
      return state.project.pages.find((p) => p.id === state.project!.currentPageId) || null;
    },

    get selectedObjects() {
      const state = get();
      const page = state.currentPage;
      if (!page) return [];
      return page.objects.filter((obj) => state.selectedObjectIds.includes(obj.id));
    },
  })),
);
