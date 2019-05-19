using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace back_end.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerGroups",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiscountCodes",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(nullable: true),
                    PromotionOption = table.Column<int>(nullable: false),
                    PromotionValue = table.Column<decimal>(nullable: false),
                    MinValue = table.Column<decimal>(nullable: false),
                    ApplyWith = table.Column<int>(nullable: false),
                    CustomerGroup = table.Column<int>(nullable: false),
                    NumberUsageLimits = table.Column<int>(nullable: false),
                    CustomerUsageLimits = table.Column<bool>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    AmountUsed = table.Column<int>(nullable: false),
                    StartTime = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountCodes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductGroups",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiscountCodeCustomerGroup",
                columns: table => new
                {
                    DiscountCodeId = table.Column<long>(nullable: false),
                    Id = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountCodeCustomerGroup", x => new { x.Id, x.DiscountCodeId });
                    table.ForeignKey(
                        name: "FK_DiscountCodeCustomerGroup_DiscountCodes_DiscountCodeId",
                        column: x => x.DiscountCodeId,
                        principalTable: "DiscountCodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiscountCodeCustomerGroup_CustomerGroups_Id",
                        column: x => x.Id,
                        principalTable: "CustomerGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiscountCodeProductGroup",
                columns: table => new
                {
                    DiscountCodeId = table.Column<long>(nullable: false),
                    Id = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountCodeProductGroup", x => new { x.Id, x.DiscountCodeId });
                    table.ForeignKey(
                        name: "FK_DiscountCodeProductGroup_DiscountCodes_DiscountCodeId",
                        column: x => x.DiscountCodeId,
                        principalTable: "DiscountCodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiscountCodeProductGroup_ProductGroups_Id",
                        column: x => x.Id,
                        principalTable: "ProductGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiscountCodeProduct",
                columns: table => new
                {
                    DiscountCodeId = table.Column<long>(nullable: false),
                    Id = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountCodeProduct", x => new { x.Id, x.DiscountCodeId });
                    table.ForeignKey(
                        name: "FK_DiscountCodeProduct_DiscountCodes_DiscountCodeId",
                        column: x => x.DiscountCodeId,
                        principalTable: "DiscountCodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiscountCodeProduct_Products_Id",
                        column: x => x.Id,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCodeCustomerGroup_DiscountCodeId",
                table: "DiscountCodeCustomerGroup",
                column: "DiscountCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCodeProduct_DiscountCodeId",
                table: "DiscountCodeProduct",
                column: "DiscountCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCodeProductGroup_DiscountCodeId",
                table: "DiscountCodeProductGroup",
                column: "DiscountCodeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiscountCodeCustomerGroup");

            migrationBuilder.DropTable(
                name: "DiscountCodeProduct");

            migrationBuilder.DropTable(
                name: "DiscountCodeProductGroup");

            migrationBuilder.DropTable(
                name: "CustomerGroups");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "DiscountCodes");

            migrationBuilder.DropTable(
                name: "ProductGroups");
        }
    }
}
