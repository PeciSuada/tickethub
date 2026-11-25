namespace Market.Application.Modules.Catalog.SeatCategories.Queries.GetById;

public class GetSeatCategoryByIdQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string ColorHex { get; init; }
    public required bool IsEnabled { get; init; }
}