using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DependencySystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectTeamMemberRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TechnicalSkills",
                table: "TeamMemberProfiles",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "SelfIntroduction",
                table: "TeamMemberProfiles",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MobileNumber",
                table: "TeamMemberProfiles",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "TeamMemberProfiles",
                keyColumn: "TechnicalSkills",
                keyValue: null,
                column: "TechnicalSkills",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "TechnicalSkills",
                table: "TeamMemberProfiles",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "TeamMemberProfiles",
                keyColumn: "SelfIntroduction",
                keyValue: null,
                column: "SelfIntroduction",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "SelfIntroduction",
                table: "TeamMemberProfiles",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "TeamMemberProfiles",
                keyColumn: "MobileNumber",
                keyValue: null,
                column: "MobileNumber",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MobileNumber",
                table: "TeamMemberProfiles",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
