import { useEffect, useState } from "react";
import { getClient } from "./grpc";
import { VitalSigns, VitalRequest } from "./gen/patient_monitor_pb";

import { useConfig } from './ConfigContext';

export default function App() {
  const [vitals, setVitals] = useState<VitalSigns[]>([]);

  const config = useConfig();
  const client = getClient();

  useEffect(() => {
    const streamVitals = async () => {
      const req = new VitalRequest({ patientId: "12345" });
      const stream = client.streamVitals(req);
      for await (const item of stream) {
        setVitals(prev => [...prev.slice(config.heartTrendLength), item]);
      }
    };

    streamVitals().catch(console.error);
  }, []);

  // Render as you wish (chart, gauges...)
}
