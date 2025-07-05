
import { PatientMonitorClient } from './generated/patient_monitor_pb_service';
import { grpc } from '@improbable-eng/grpc-web';

export const monitoringClient = new PatientMonitorClient(
  'https://localhost:5001',
  {
    transport: grpc.CrossBrowserHttpTransport({ withCredentials: false })
  }
);
