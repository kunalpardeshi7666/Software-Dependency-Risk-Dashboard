
using DependencyRiskDashboard.Services;
using DependencyRiskDashboard.Services.Interfaces;

namespace DependencyRiskDashboard
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            //builder.Services.AddHttpClient<IGitHubAnalysisService, GitHubAnalysisService>();
            builder.Services.AddHttpClient<GitHubAnalysisService>();
            builder.Services.AddHttpClient<GitHubDependencyService>();



            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
