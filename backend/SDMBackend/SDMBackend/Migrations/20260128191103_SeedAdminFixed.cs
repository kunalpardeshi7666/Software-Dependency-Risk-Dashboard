using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SDMBackend.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$E0u0lYH8A0e7hA1vQoKJTe9lH90Oy6J5XK6Vb3CMhYvgn5rXzEoG.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$6cPYgU8HuLPnuxG9SZJx2.4dIgUr/WhaZ3m0hE0Uh3hy17ivSHe4K");
        }
    }
}
