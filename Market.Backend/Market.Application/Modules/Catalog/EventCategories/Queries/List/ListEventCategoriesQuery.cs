namespace Market.Application.Modules.Catalog.EventCategories.Queries.List;

public sealed class ListEventCategoriesQuery : BasePagedQuery<ListEventCategoriesQueryDto>
{
    public string? Search { get; init; }
    public bool? OnlyEnabled { get; init; }
}
