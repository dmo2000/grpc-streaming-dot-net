import { useEffect, useState } from "react";
import { getClient } from "./grpc";
import { VitalResponse, VitalRequest } from "./gen/patient_monitor_pb";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { GaugeComponent } from 'react-gauge-component';
import { useConfig } from './ConfigContext';

export default function App() {
  const [vitals, setVitals] = useState<VitalResponse[]>([]);
  const [latestVital, setLatestVital] = useState<VitalResponse | null>(null);

  const config = useConfig();
  const client = getClient();

  useEffect(() => {
    const streamVitals = async () => {
      const req = { patientId: "12345" } as VitalRequest;
      const stream = client.streamVitals(req);
      for await (const item of stream) {
        setVitals(prev => {
          if (prev.length >= config.heartTrendLength) {
            return [...prev.slice(1), item];
          }
          return [...prev, item];
        });
        setLatestVital(item);
      }
    };

    streamVitals().catch(console.error);
  }, []);

    return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Heart Rate Trend (Last 30s)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={vitals}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottomRight", offset: 0 }} />
          <YAxis domain={[65, 90]} label={{ value: "BPM", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="heartRate" stroke="#e63946" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <h2>🩺 Patient Monitor</h2>

      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h4>SpO₂</h4>
          <GaugeComponent
            value={latestVital?.spo2 ?? 0}
            minValue={80}
            arc={{subArcs: [{ color: "red", limit: 92 }, { color: "green" }]}}
            maxValue={100}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h4>Temperature</h4>
          <GaugeComponent
            value={latestVital?.temperature ?? 0}
            minValue={35}
            arc={{subArcs: [{ color: "green" }, { color: "red", limit: 37.5 }]}}
            maxValue={40}
          />
        </div>
      </div>
    </div>
  );
}
