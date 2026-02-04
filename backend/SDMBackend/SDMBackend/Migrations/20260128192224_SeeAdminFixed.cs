using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SDMBackend.Migrations
{
    /// <inheritdoc />
    public partial class SeeAdminFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$7BXuhF1wT/3BpmG1/UqukOlcW7XXuP7NygInXoqq1UENtHikRgCNK");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserID",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$E0u0lYH8A0e7hA1vQoKJTe9lH90Oy6J5XK6Vb3CMhYvgn5rXzEoG.");
        }
    }
}
