using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SDMBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "Email", "Name", "PasswordHash", "Role" },
                values: new object[] { 1, "admin@example.com", "Admin", "$2a$11$6cPYgU8HuLPnuxG9SZJx2.4dIgUr/WhaZ3m0hE0Uh3hy17ivSHe4K", "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1);
        }
    }
}
