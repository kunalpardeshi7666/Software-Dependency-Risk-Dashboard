using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SDMBackend.Migrations
{
    /// <inheritdoc />
    public partial class UserDeveloperSeparation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Developers_UserID",
                table: "Developers");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Users",
                newName: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Developers_UserID",
                table: "Developers",
                column: "UserID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Developers_UserID",
                table: "Developers");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "UserName");

            migrationBuilder.CreateIndex(
                name: "IX_Developers_UserID",
                table: "Developers",
                column: "UserID");
        }
    }
}
