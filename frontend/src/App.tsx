
import { useEffect, useState } from 'react';
import { monitoringClient } from './grpc';
import { VitalRequest, VitalSigns } from './generated/patient_monitor_pb';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

import GaugeChart from 'react-gauge-chart';

type Vital = {
  timestamp: string;
  heartRate: number;
  spo2: number;
  temperature: number;
};

export default function App() {
  const [vitalHistory, setVitalHistory] = useState<Vital[]>([]);

  useEffect(() => {
    const req = new VitalRequest();
    req.setPatientid('12345');

    const stream = monitoringClient.streamVitals(req, undefined);

    stream.on('data', (data: VitalSigns) => {
      const v: Vital = {
        timestamp: data.getTimestamp(),
        heartRate: data.getHeartRate(),
        spo2: data.getSpo2(),
        temperature: data.getTemperature(),
      };

      setVitalHistory(prev => [...prev.slice(-19), v]);
    });

    stream.on('error', err => console.error('Stream error', err));
    stream.on('end', () => console.log('Stream closed'));

    return () => stream.cancel();
  }, []);

  const latest = vitalHistory[vitalHistory.length - 1];

  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Patient Vitals Monitor</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2 h-72">
          <h2 className="text-lg mb-2">Heart Rate (bpm)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={t => t.slice(11, 19)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="heartRate" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg mb-2">SpO₂ (%)</h2>
          <GaugeChart
            id="spo2-gauge"
            nrOfLevels={20}
            percent={(latest?.spo2 || 0) / 100}
            textColor="#000"
            colors={['#FF5F6D', '#FFC371', '#00C49F']}
            formatTextValue={val => `${latest?.spo2?.toFixed(1) || '–'}%`}
          />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg mb-2">Temperature (°C)</h2>
          <GaugeChart
            id="temp-gauge"
            nrOfLevels={15}
            arcsLength={[0.2, 0.3, 0.5]}
            colors={['#00C49F', '#FFBB28', '#FF8042']}
            percent={(latest?.temperature || 36) / 42}
            textColor="#000"
            formatTextValue={val => `${latest?.temperature?.toFixed(1) || '–'}°C`}
          />
        </div>
      </section>
    </main>
  );
}
