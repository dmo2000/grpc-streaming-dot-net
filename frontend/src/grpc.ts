// src/grpc.ts
import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { PatientMonitorService } from "./gen/patient_monitor_pb";


import { useConfig } from './ConfigContext';

export const getClient = () => {
  const config = useConfig();
  const transport = createGrpcWebTransport({
    baseUrl: config.vitalsBaseUrl,
  });
  return createClient(
    PatientMonitorService,
    transport,
  );
}
