namespace Market.Application.Modules.Catalog.Seats.Queries.GetById;

public class GetSeatByIdQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string RowLabel { get; init; }
    public required int Number { get; init; }
    public required int SectorId { get; init; }
    public required string SectorName { get; init; }
    public required int SeatCategoryId { get; init; }
    public required string SeatCategoryName { get; init; }
    public required bool IsEnabled { get; init; }
}