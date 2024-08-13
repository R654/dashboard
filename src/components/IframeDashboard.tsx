import React, { useState, useEffect } from 'react';
import { UrlConfig } from '../types';

interface IframeDashboardProps {
  urlConfigs: UrlConfig[];
  interval: number;
}

const IframeDashboard: React.FC<IframeDashboardProps> = ({ urlConfigs, interval }) => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [nextUpdate, setNextUpdate] = useState<number>(interval);

  useEffect(() => {
    const reloadIframes = () => {
      urlConfigs.forEach((config, index) => {
        const iframe = document.getElementById(`iframe-${index}`) as HTMLIFrameElement;
        const scrollPosition = iframe?.contentWindow?.scrollY || 0;

        localStorage.setItem(`scrollPosition_${config.url}`, scrollPosition.toString());
        iframe.src = config.url;
      });
      setLastUpdate(new Date());
      setNextUpdate(interval);
    };

    const applyFilter = (iframe: HTMLIFrameElement, filterType: 'id' | 'class' | '', filterValue: string) => {
      if (!filterType || !filterValue) return;

      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          let targetElement: HTMLElement | null = null;
          if (filterType === 'id') {
            targetElement = doc.getElementById(filterValue);
          } else if (filterType === 'class') {
            targetElement = doc.getElementsByClassName(filterValue)[0] as HTMLElement;
          }
          
          if (targetElement) {
            doc.body.innerHTML = '';
            doc.body.appendChild(targetElement);
          }
        }
      } catch (e) {
        console.error('Cannot apply filter:', e);
      }
    };

    const updateScrollPositions = () => {
      urlConfigs.forEach((config, index) => {
        const iframe = document.getElementById(`iframe-${index}`) as HTMLIFrameElement;
        const savedScrollPosition = localStorage.getItem(`scrollPosition_${config.url}`);
        iframe.onload = () => {
          applyFilter(iframe, config.filterType, config.filterValue);
          if (savedScrollPosition) {
            iframe.contentWindow?.scrollTo(0, parseInt(savedScrollPosition, 10));
          }
        };
      });
    };

    reloadIframes();
    updateScrollPositions();

    const intervalId = setInterval(reloadIframes, interval * 1000);
    const countdownId = setInterval(() => {
      setNextUpdate(prev => (prev > 0 ? prev - 1 : interval));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [urlConfigs, interval]);

  return (
    <div>
      <header>
        <div>Last Update: {lastUpdate?.toLocaleString()}</div>
        <div>Next Update in: {nextUpdate} seconds</div>
      </header>
      <div className="iframes-container">
        {urlConfigs.map((config, index) => (
          <iframe key={index} id={`iframe-${index}`} src={config.url} title={`iframe-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default IframeDashboard;
