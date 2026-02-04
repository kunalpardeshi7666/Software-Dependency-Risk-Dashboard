using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    [AllowAnonymous]
    public IActionResult Public()
        => Ok("Public OK");

    [HttpGet("auth")]
    [Authorize]
    public IActionResult Auth()
        => Ok("Authorized OK");

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult Admin()
        => Ok("Admin OK");
}
