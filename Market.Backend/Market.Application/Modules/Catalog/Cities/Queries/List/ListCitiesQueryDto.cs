namespace Market.Application.Modules.Catalog.Cities.Queries.List;

public sealed class ListCitiesQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required bool IsEnabled { get; init; }
}
