// preload does not use import and export
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('weatherStore', {
    api: (data) => ipcRenderer.invoke('get-api', data),
    weather_code: () =>  ipcRenderer.invoke('get-weather-codes'),
    temp: (temp) => ipcRenderer.invoke('temp', temp),
    location: (data) => ipcRenderer.invoke('locate',data),
});