
using Grpc.Core;
using PatientMonitoring;

public class PatientMonitorServiceImpl : PatientMonitorService.PatientMonitorServiceBase
{
    private readonly Random _rand = new();

    public override async Task StreamVitals(VitalRequest request,
        IServerStreamWriter<VitalResponse> responseStream,
        ServerCallContext context)
    {
        var HEALTHY_HEARTBEAT = new List<int>([
            72, 73, 72, 71, 72, 74, 73, 72, 71, 72,
            73, 74, 72, 70, 71, 72, 73, 74, 75, 72,
            71, 72, 73, 71, 72, 73, 74, 72, 71, 72
        ]);
        int count = 0;
        while (!context.CancellationToken.IsCancellationRequested)
        {
            var vitals = new VitalResponse
            {
                Timestamp = DateTimeOffset.UtcNow.ToString("O"),
                HeartRate = HEALTHY_HEARTBEAT[count % HEALTHY_HEARTBEAT.Count],
                Spo2 = Math.Round(95 + _rand.NextDouble() * 5, 1),
                Temperature = Math.Round(36 + _rand.NextDouble() * 1.5, 1)
            };

            await responseStream.WriteAsync(vitals);
            await Task.Delay(1000);
            count++;
        }
    }
}
