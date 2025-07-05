
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using PatientMonitoring;
using Grpc.AspNetCore.Web;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGrpc();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod());
});
var app = builder.Build();
app.UseCors("AllowAll");
app.UseRouting();
app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });
app.MapGrpcService<PatientMonitorService>().EnableGrpcWeb();
app.Run();
