namespace Market.Application.Modules.Catalog.Sectors.Queries.GetById;

public class GetSectorByIdQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required int VenueId { get; init; }
    public required string VenueName { get; init; }
    public required bool IsEnabled { get; init; }
}