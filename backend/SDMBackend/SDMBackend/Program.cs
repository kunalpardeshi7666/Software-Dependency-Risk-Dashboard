using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers
builder.Services.AddControllers();

// Add CORS if you use React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:3000");
    });
});

var app = builder.Build();

app.UseCors("ReactApp");
app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.Run();
