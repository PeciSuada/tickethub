using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Market.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameRoleFlags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsManager",
                table: "Users",
                newName: "IsOrganizer");

            migrationBuilder.RenameColumn(
                name: "IsEmployee",
                table: "Users",
                newName: "IsScanner");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsScanner",
                table: "Users",
                newName: "IsEmployee");

            migrationBuilder.RenameColumn(
                name: "IsOrganizer",
                table: "Users",
                newName: "IsManager");
        }
    }
}
