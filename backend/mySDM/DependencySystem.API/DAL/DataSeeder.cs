using DependencySystem.API.Model;
using Microsoft.AspNetCore.Identity;

namespace DependencySystem.API.DAL
{
    public class DataSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<DataSeeder> _logger;

        public DataSeeder(
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            ILogger<DataSeeder> logger)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await SeedRoles();
            await SeedAdminUser();
        }

        private async Task SeedRoles()
        {
            string[] roles = { "Admin", "Developer", "Tester" };

            foreach (var roleName in roles)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    var role = new IdentityRole(roleName);
                    var result = await _roleManager.CreateAsync(role);

                    if (result.Succeeded)
                        _logger.LogInformation($"Created role: {roleName}");
                    else
                        _logger.LogError($"Failed to create role {roleName}: {result.Errors.FirstOrDefault()?.Description}");
                }
            }
        }

        private async Task SeedAdminUser()
        {
            var adminEmail = "yuvrajrathod8390@gmail.com";
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    PhoneNumber = "9999999999",
                    FirstName = "Super",
                    LastName = "Admin",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var password = "Admin@123";
                var result = await _userManager.CreateAsync(adminUser, password);

                if (result.Succeeded)
                {
                    _logger.LogInformation($"Admin user created: {adminEmail}");
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                }
                else
                {
                    _logger.LogError($"Failed to create admin user: {result.Errors.FirstOrDefault()?.Description}");
                }
            }
            else
            {
                _logger.LogInformation($"Admin user already exists: {adminEmail}");
            }
        }
    }
}
