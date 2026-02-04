using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DependencySystem.API.Migrations
{
    /// <inheritdoc />
    public partial class updatetaskentrasd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Module_Project_ProjectID",
                table: "Module");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectManagers_Project_ProjectID",
                table: "ProjectManagers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectStakeholders_Project_ProjectID",
                table: "ProjectStakeholders");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeamMembers_AspNetUsers_ApplicationUserId",
                table: "ProjectTeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeamMembers_Project_ProjectID",
                table: "ProjectTeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeamMembers_Project_ProjectID1",
                table: "ProjectTeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTechnologies_Project_ProjectID",
                table: "ProjectTechnologies");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTeamMembers_ApplicationUserId",
                table: "ProjectTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTeamMembers_ProjectID1",
                table: "ProjectTeamMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Project",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "ProjectTeamMembers");

            migrationBuilder.DropColumn(
                name: "ProjectID1",
                table: "ProjectTeamMembers");

            migrationBuilder.RenameTable(
                name: "Project",
                newName: "Projects");

            migrationBuilder.RenameIndex(
                name: "IX_Project_ProjectName",
                table: "Projects",
                newName: "IX_Projects_ProjectName");

            migrationBuilder.AlterColumn<string>(
                name: "UserID",
                table: "ProjectManagers",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:ColumnOrder", 2);

            migrationBuilder.AlterColumn<int>(
                name: "ProjectID",
                table: "ProjectManagers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 1);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Projects",
                table: "Projects",
                column: "ProjectID");

            migrationBuilder.AddForeignKey(
                name: "FK_Module_Projects_ProjectID",
                table: "Module",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectManagers_Projects_ProjectID",
                table: "ProjectManagers",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectStakeholders_Projects_ProjectID",
                table: "ProjectStakeholders",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeamMembers_Projects_ProjectID",
                table: "ProjectTeamMembers",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTechnologies_Projects_ProjectID",
                table: "ProjectTechnologies",
                column: "ProjectID",
                principalTable: "Projects",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Module_Projects_ProjectID",
                table: "Module");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectManagers_Projects_ProjectID",
                table: "ProjectManagers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectStakeholders_Projects_ProjectID",
                table: "ProjectStakeholders");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeamMembers_Projects_ProjectID",
                table: "ProjectTeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTechnologies_Projects_ProjectID",
                table: "ProjectTechnologies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Projects",
                table: "Projects");

            migrationBuilder.RenameTable(
                name: "Projects",
                newName: "Project");

            migrationBuilder.RenameIndex(
                name: "IX_Projects_ProjectName",
                table: "Project",
                newName: "IX_Project_ProjectName");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "ProjectTeamMembers",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "ProjectID1",
                table: "ProjectTeamMembers",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserID",
                table: "ProjectManagers",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:ColumnOrder", 2)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "ProjectID",
                table: "ProjectManagers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 1);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Project",
                table: "Project",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeamMembers_ApplicationUserId",
                table: "ProjectTeamMembers",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeamMembers_ProjectID1",
                table: "ProjectTeamMembers",
                column: "ProjectID1");

            migrationBuilder.AddForeignKey(
                name: "FK_Module_Project_ProjectID",
                table: "Module",
                column: "ProjectID",
                principalTable: "Project",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectManagers_Project_ProjectID",
                table: "ProjectManagers",
                column: "ProjectID",
                principalTable: "Project",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectStakeholders_Project_ProjectID",
                table: "ProjectStakeholders",
                column: "ProjectID",
                principalTable: "Project",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeamMembers_AspNetUsers_ApplicationUserId",
                table: "ProjectTeamMembers",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeamMembers_Project_ProjectID",
                table: "ProjectTeamMembers",
                column: "ProjectID",
                principalTable: "Project",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeamMembers_Project_ProjectID1",
                table: "ProjectTeamMembers",
                column: "ProjectID1",
                principalTable: "Project",
                principalColumn: "ProjectID");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTechnologies_Project_ProjectID",
                table: "ProjectTechnologies",
                column: "ProjectID",
                principalTable: "Project",
                principalColumn: "ProjectID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
