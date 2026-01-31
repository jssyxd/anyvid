import { create } from 'zustand';

export interface VideoFile {
  id: string;
  file: File;
  previewUrl: string;
  meta: {
    duration: number;
    width: number;
    height: number;
    format: string;
  };
}

interface AppState {
  files: VideoFile[];
  addFile: (file: VideoFile) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  currentFileId: string | null;
  setCurrentFileId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  files: [],
  currentFileId: null,
  addFile: (file) => set((state) => ({ files: [...state.files, file], currentFileId: file.id })),
  removeFile: (id) => set((state) => ({ 
    files: state.files.filter((f) => f.id !== id),
    currentFileId: state.currentFileId === id ? null : state.currentFileId
  })),
  clearFiles: () => set({ files: [], currentFileId: null }),
  setCurrentFileId: (id) => set({ currentFileId: id }),
}));
