using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWithSeeder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "PasswordHash", "Username" },
                values: new object[,]
                {
                    { 1, "ali@teta.com", "hash123", "deneme_ali" },
                    { 2, "ayse@teta.com", "hash456", "deneme_ayse" }
                });

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "Id", "Content", "CreatedAt", "DeletedAt", "Description", "FilePath", "LessonName", "Title", "UpdatedAt", "UserId" },
                values: new object[,]
                {
                    { 1, "Class ve Object yapısı.", new DateTime(2026, 3, 16, 17, 5, 53, 147, DateTimeKind.Local).AddTicks(61), null, "", null, "Programlama", "C# Temelleri", null, 1 },
                    { 2, "useState kullanım detayları.", new DateTime(2026, 3, 16, 17, 5, 53, 147, DateTimeKind.Local).AddTicks(74), null, "", null, "Frontend", "React State", null, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Notes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
