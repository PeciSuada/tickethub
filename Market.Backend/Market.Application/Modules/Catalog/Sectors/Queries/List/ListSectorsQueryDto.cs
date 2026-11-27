namespace Market.Application.Modules.Catalog.Sectors.Queries.List;

public sealed class ListSectorsQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required int VenueId { get; init; }
    public required string VenueName { get; init; }
    public required int SeatCount { get; init; }
    public required bool IsEnabled { get; init; }
}