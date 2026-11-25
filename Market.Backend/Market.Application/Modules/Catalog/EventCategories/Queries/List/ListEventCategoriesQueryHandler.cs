namespace Market.Application.Modules.Catalog.EventCategories.Queries.List;

public sealed class ListEventCategoriesQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListEventCategoriesQuery, PageResult<ListEventCategoriesQueryDto>>
{
    public async Task<PageResult<ListEventCategoriesQueryDto>> Handle(
        ListEventCategoriesQuery request, CancellationToken ct)
    {
        var q = ctx.EventCategories.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
             q = q.Where(x => x.Name.Contains(request.Search));
        }

        if (request.OnlyEnabled is not null)
            q = q.Where(x => x.IsEnabled == request.OnlyEnabled);

        // ThenBy(Id) makes the order stable (Name is not unique), so paging never skips or repeats rows.
        var projectedQuery = q.OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Select(x => new ListEventCategoriesQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                IsEnabled = x.IsEnabled
            });

        return await PageResult<ListEventCategoriesQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
