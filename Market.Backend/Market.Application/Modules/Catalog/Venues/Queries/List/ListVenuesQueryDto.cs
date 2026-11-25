namespace Market.Application.Modules.Catalog.Venues.Queries.List;

public sealed class ListVenuesQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Address { get; init; }
    public required int CityId { get; init; }
    public required string CityName { get; init; }
    public required bool IsEnabled { get; init; }
}