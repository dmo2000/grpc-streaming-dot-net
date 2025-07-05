
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using PatientMonitoring;
using Grpc.AspNetCore.Web;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGrpc();
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseRouting();
app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });
app.MapGrpcService<PatientMonitorService>().EnableGrpcWeb();
app.Run();
