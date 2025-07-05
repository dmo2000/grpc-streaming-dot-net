
using Grpc.Core;
using PatientMonitoring;

public class PatientMonitorService : PatientMonitoring.PatientMonitorService.PatientMonitorServiceBase
{
    private readonly Random _rand = new();

    public override async Task StreamVitals(VitalRequest request,
        IServerStreamWriter<VitalResponse> responseStream,
        ServerCallContext context)
    {
        while (!context.CancellationToken.IsCancellationRequested)
        {
            var vitals = new VitalResponse
            {
                Timestamp = DateTimeOffset.UtcNow.ToString("O"),
                HeartRate = _rand.Next(60, 100),
                Spo2 = Math.Round(95 + _rand.NextDouble() * 5, 1),
                Temperature = Math.Round(36 + _rand.NextDouble() * 1.5, 1)
            };

            await responseStream.WriteAsync(vitals);
            await Task.Delay(1000);
        }
    }
}
