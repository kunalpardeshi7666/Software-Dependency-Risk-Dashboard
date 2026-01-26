using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Login.Controllers
{


    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public IActionResult SecureEndpoint()
        {
            return Ok("JWT Authentication Successful");
        }
    }

}
