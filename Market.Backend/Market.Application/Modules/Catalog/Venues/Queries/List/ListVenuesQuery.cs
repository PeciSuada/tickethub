namespace Market.Application.Modules.Catalog.Venues.Queries.List;

public sealed class ListVenuesQuery : BasePagedQuery<ListVenuesQueryDto>
{
    public string? Search { get; init; }
    public int? CityId { get; init; }
    public bool? OnlyEnabled { get; init; }
}