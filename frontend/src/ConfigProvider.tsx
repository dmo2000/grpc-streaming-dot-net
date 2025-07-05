import { ReactNode, useEffect, useState } from 'react';
import { ConfigContext, AppConfig } from './ConfigContext';

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/config.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch config.json');
        return res.json();
      })
      .then(setConfig)
      .catch(setError);
  }, []);

  if (error) {
    return <pre style={{ color: "red" }}>Config load failed: {error}</pre>;
  }

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );

}
