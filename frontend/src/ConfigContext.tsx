import { createContext, useContext } from 'react';

export type AppConfig = {
  heartTrendLength: number;
  vitalsBaseUrl: string;
};

export const ConfigContext = createContext<AppConfig | null>(null);

export const useConfig = (): AppConfig => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("Config not loaded yet");
  return ctx;
};
