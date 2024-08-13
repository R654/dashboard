import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SettingsModal from './components/SettingsModal';
import IframeDashboard from './components/IframeDashboard';
import { UrlConfig } from './types';

const App: React.FC = () => {
  const [urlConfigs, setUrlConfigs] = useState<UrlConfig[]>([]);
  const [interval, setInterval] = useState<number>(30);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedConfigs = JSON.parse(localStorage.getItem('urlConfigs') || '[]') as UrlConfig[];
    const savedInterval = parseInt(localStorage.getItem('interval') || '30', 10);
    setUrlConfigs(savedConfigs);
    setInterval(savedInterval);
  }, []);

  const saveSettings = (newConfigs: UrlConfig[], newInterval: number) => {
    setUrlConfigs(newConfigs);
    setInterval(newInterval);
    localStorage.setItem('urlConfigs', JSON.stringify(newConfigs));
    localStorage.setItem('interval', newInterval.toString());
    setIsSettingsOpen(false);
  };

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <button onClick={() => setIsSettingsOpen(true)}>Settings</button>
      {isSettingsOpen && (
        <SettingsModal
          urlConfigs={urlConfigs}
          interval={interval}
          onSave={saveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
      <IframeDashboard urlConfigs={urlConfigs} interval={interval} />
    </div>
  );
};

export default App;
