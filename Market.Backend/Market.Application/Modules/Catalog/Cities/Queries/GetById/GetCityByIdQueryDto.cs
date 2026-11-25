namespace Market.Application.Modules.Catalog.Cities.Queries.GetById;

public class GetCityByIdQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required bool IsEnabled { get; init; }
}
