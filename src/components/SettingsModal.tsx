import React, { useState, useEffect } from 'react';
import Sortable from 'sortablejs';
import { UrlConfig } from '../types';

interface SettingsModalProps {
  urlConfigs: UrlConfig[];
  interval: number;
  onSave: (urlConfigs: UrlConfig[], interval: number) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ urlConfigs, interval, onSave, onClose }) => {
  const [localConfigs, setLocalConfigs] = useState<UrlConfig[]>([...urlConfigs]);
  const [localInterval, setLocalInterval] = useState<number>(interval);

  useEffect(() => {
    const sortable = Sortable.create(document.getElementById('urlList') as HTMLElement, {
      handle: '.drag-handle',
      animation: 150,
      onEnd: () => {
        const newConfigs = Array.from(document.querySelectorAll<HTMLLIElement>('#urlList li')).map(
          (li) => {
            const url = (li.querySelector('input[name="url"]') as HTMLInputElement).value;
            const filterType = (li.querySelector('select[name="filterType"]') as HTMLSelectElement)
              .value as 'id' | 'class' | '';
            const filterValue = (li.querySelector('input[name="filterValue"]') as HTMLInputElement)
              .value;
            return { url, filterType, filterValue };
          }
        );
        setLocalConfigs(newConfigs);
      }
    });
    return () => {
      sortable.destroy();
    };
  }, []);

  const addUrlItem = () => {
    setLocalConfigs([...localConfigs, { url: '', filterType: '', filterValue: '' }]);
  };

  const updateUrlConfig = (index: number, updatedConfig: Partial<UrlConfig>) => {
    const newConfigs = [...localConfigs];
    newConfigs[index] = { ...newConfigs[index], ...updatedConfig };
    setLocalConfigs(newConfigs);
  };

  const removeUrlItem = (index: number) => {
    setLocalConfigs(localConfigs.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localConfigs, localInterval);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Settings</h2>
        <label>Interval (seconds):</label>
        <input
          type="number"
          value={localInterval}
          onChange={e => setLocalInterval(parseInt(e.target.value, 10))}
        />
        <ul id="urlList">
          {localConfigs.map((config, index) => (
            <li key={index}>
              <span className="drag-handle">?</span>
              <input
                type="text"
                name="url"
                value={config.url}
                onChange={e => updateUrlConfig(index, { url: e.target.value })}
              />
              <select
                name="filterType"
                value={config.filterType}
                onChange={e => updateUrlConfig(index, { filterType: e.target.value as 'id' | 'class' })}
              >
                <option value="">No Filter</option>
                <option value="id">ID</option>
                <option value="class">Class</option>
              </select>
              <input
                type="text"
                name="filterValue"
                placeholder="Filter Value"
                value={config.filterValue}
                onChange={e => updateUrlConfig(index, { filterValue: e.target.value })}
              />
              <button onClick={() => removeUrlItem(index)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={addUrlItem}>Add URL</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default SettingsModal;
