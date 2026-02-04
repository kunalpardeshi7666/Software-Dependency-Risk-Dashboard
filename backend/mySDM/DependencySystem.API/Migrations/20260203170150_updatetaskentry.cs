using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DependencySystem.API.Migrations
{
    /// <inheritdoc />
    public partial class updatetaskentry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskDependencies_Tasks_DependsOnTaskID",
                table: "TaskDependencies");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskDependencies_Tasks_TaskID",
                table: "TaskDependencies");

            migrationBuilder.RenameColumn(
                name: "TeamRole",
                table: "ProjectTeamMembers",
                newName: "Role");

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

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeamMembers_ApplicationUserId",
                table: "ProjectTeamMembers",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeamMembers_ProjectID1",
                table: "ProjectTeamMembers",
                column: "ProjectID1");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeamMembers_AspNetUsers_ApplicationUserId",
                table: "ProjectTeamMembers",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTeamMembers_Project_ProjectID1",
                table: "ProjectTeamMembers",
                column: "ProjectID1",
                principalTable: "Project",
                principalColumn: "ProjectID");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskDependencies_Tasks_DependsOnTaskID",
                table: "TaskDependencies",
                column: "DependsOnTaskID",
                principalTable: "Tasks",
                principalColumn: "TaskID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskDependencies_Tasks_TaskID",
                table: "TaskDependencies",
                column: "TaskID",
                principalTable: "Tasks",
                principalColumn: "TaskID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeamMembers_AspNetUsers_ApplicationUserId",
                table: "ProjectTeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTeamMembers_Project_ProjectID1",
                table: "ProjectTeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskDependencies_Tasks_DependsOnTaskID",
                table: "TaskDependencies");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskDependencies_Tasks_TaskID",
                table: "TaskDependencies");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTeamMembers_ApplicationUserId",
                table: "ProjectTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTeamMembers_ProjectID1",
                table: "ProjectTeamMembers");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "ProjectTeamMembers");

            migrationBuilder.DropColumn(
                name: "ProjectID1",
                table: "ProjectTeamMembers");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "ProjectTeamMembers",
                newName: "TeamRole");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskDependencies_Tasks_DependsOnTaskID",
                table: "TaskDependencies",
                column: "DependsOnTaskID",
                principalTable: "Tasks",
                principalColumn: "TaskID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskDependencies_Tasks_TaskID",
                table: "TaskDependencies",
                column: "TaskID",
                principalTable: "Tasks",
                principalColumn: "TaskID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
