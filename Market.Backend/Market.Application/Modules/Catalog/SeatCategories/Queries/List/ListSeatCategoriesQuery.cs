namespace Market.Application.Modules.Catalog.SeatCategories.Queries.List;

public sealed class ListSeatCategoriesQuery : BasePagedQuery<ListSeatCategoriesQueryDto>
{
    public string? Search { get; init; }
    public bool? OnlyEnabled { get; init; }
}
