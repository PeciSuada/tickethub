namespace Market.Application.Modules.Catalog.Cities.Queries.List;

public sealed class ListCitiesQuery : BasePagedQuery<ListCitiesQueryDto>
{
    public string? Search { get; init; }
    public bool? OnlyEnabled { get; init; }
}
