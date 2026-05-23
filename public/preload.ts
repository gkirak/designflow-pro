import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, args: any) => ipcRenderer.send(channel, args),
    on: (channel: string, func: Function) =>
      ipcRenderer.on(channel, (event, ...args) => func(...args)),
    once: (channel: string, func: Function) =>
      ipcRenderer.once(channel, (event, ...args) => func(...args)),
    invoke: (channel: string, args: any) => ipcRenderer.invoke(channel, args),
  },
  app: {
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    getTempPath: () => ipcRenderer.invoke('get-temp-path'),
  },
});
