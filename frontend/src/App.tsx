import { useEffect, useState } from "react";
import { getClient } from "./grpc";
import { VitalResponse, VitalRequest } from "./gen/patient_monitor_pb";

import { useConfig } from './ConfigContext';

export default function App() {
  const [vitals, setVitals] = useState<VitalResponse[]>([]);

  const config = useConfig();
  const client = getClient();

  useEffect(() => {
    const streamVitals = async () => {
      const req = { patientId: "12345" } as VitalRequest;
      const stream = client.streamVitals(req);
      for await (const item of stream) {
        setVitals(prev => [...prev.slice(config.heartTrendLength), item]);
      }
    };

    streamVitals().catch(console.error);
  }, []);

  // Render as you wish (chart, gauges...)
}
