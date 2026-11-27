namespace Market.Application.Modules.Catalog.Seats.Queries.List;

public sealed class ListSeatsQueryDto
{
    public required int Id { get; init; }

    /// <summary>Short seat label, e.g. "E8" (row + number).</summary>
    public required string Name { get; init; }
    public required string RowLabel { get; init; }
    public required int Number { get; init; }
    public required int SectorId { get; init; }
    public required string SectorName { get; init; }
    public required string VenueName { get; init; }
    public required int SeatCategoryId { get; init; }
    public required string SeatCategoryName { get; init; }
    public required string SeatCategoryColorHex { get; init; }
    public required bool IsEnabled { get; init; }
}