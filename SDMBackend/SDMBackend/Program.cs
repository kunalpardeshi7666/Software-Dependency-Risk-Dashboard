/*using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;

var builder = WebApplication.CreateBuilder(args);

// MySQL DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")
        )
    )
);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin();
    });
});

builder.Configuration
.AddJsonFile("appsettings.json", optional: false)
.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
.AddEnvironmentVariables();


builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

//app.UseCors("ReactApp");


app.UseCors("AllowAll");

app.UseRouting();

app.Use(async (context, next) =>
{
    if (context.Request.Method == HttpMethods.Options)
    {
        context.Response.StatusCode = 200;
        return;
    }
    await next();
});
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Urls.Add("http://*:5000");
app.Run();
*/

/*
using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
*/
//var builder = WebApplication.CreateBuilder(args);

//// -------------------- CONFIG --------------------
//builder.Configuration
//    .AddJsonFile("appsettings.json", optional: false)
//    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
//    .AddEnvironmentVariables();

//// -------------------- DB --------------------
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseMySql(
//        builder.Configuration.GetConnectionString("DefaultConnection"),
//        ServerVersion.AutoDetect(
//            builder.Configuration.GetConnectionString("DefaultConnection")
//        )
//    )
//);

//// -------------------- CONTROLLERS --------------------
//builder.Services.AddControllers();

//// -------------------- CORS (SINGLE POLICY) --------------------
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend", policy =>
//    {
//        policy
//            .AllowAnyOrigin()        // OK for now (tighten later)
//            .AllowAnyHeader()
//            .AllowAnyMethod();
//    });
//});

//// -------------------- KESTREL --------------------
//builder.WebHost.ConfigureKestrel(options =>
//{
//    options.ListenAnyIP(5000); // Required for Elastic Beanstalk
//});

//var app = builder.Build();

//// -------------------- MIDDLEWARE ORDER --------------------
//app.UseRouting();

//app.UseCors("AllowFrontend");   // MUST be before auth & controllers

//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();

//app.Run();






using Microsoft.EntityFrameworkCore;
using SDMBackend.DAL;

var builder = WebApplication.CreateBuilder(args);

// --------------------- Configuration ---------------------
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// --------------------- DbContext ---------------------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// --------------------- Controllers ---------------------
builder.Services.AddControllers();

// --------------------- CORS ---------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",                  // local dev
                "https://d16eo2hcybk8gk.cloudfront.net" // CloudFront domain
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Important if frontend sends cookies/auth headers
    });
});

var app = builder.Build();

// --------------------- Middleware ---------------------
app.UseRouting();

app.UseCors("AllowFrontend"); // Must come before auth middleware

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
