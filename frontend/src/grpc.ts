// src/grpc.ts
import { createClient, createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { PatientMonitor } from "./gen/patient_monitor_pb";


import { useConfig } from './ConfigContext';

export const getClient = () => {
  const config = useConfig();
  const transport = createConnectTransport({
    baseUrl: config.vitalsBaseUrl,
  });
  return createPromiseClient(PatientMonitor, transport);
}
