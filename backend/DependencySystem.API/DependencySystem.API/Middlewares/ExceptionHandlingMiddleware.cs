using System.Net;
using System.Text.Json;

namespace DependencySystem.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled Exception Occurred");

                context.Response.ContentType = "application/json";

                // Default
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var message = "Something went wrong. Please try again later.";

                // ✅ You can customize status code based on exception message/type
                if (ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    message = ex.Message;
                }
                else if (ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    message = ex.Message;
                }
                else if (ex.Message.Contains("invalid", StringComparison.OrdinalIgnoreCase) ||
                         ex.Message.Contains("wrong", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    message = ex.Message;
                }
                else if (ex.Message.Contains("unauthorized", StringComparison.OrdinalIgnoreCase) ||
                         ex.Message.Contains("token", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    message = ex.Message;
                }

                var response = new
                {
                    statusCode = context.Response.StatusCode,
                    success = false,
                    message = message,
                    error = ex.Message
                };

                var json = JsonSerializer.Serialize(response);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
