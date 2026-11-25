namespace Market.Application.Modules.Catalog.SeatCategories.Queries.List;

public sealed class ListSeatCategoriesQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListSeatCategoriesQuery, PageResult<ListSeatCategoriesQueryDto>>
{
    public async Task<PageResult<ListSeatCategoriesQueryDto>> Handle(
        ListSeatCategoriesQuery request, CancellationToken ct)
    {
        var q = ctx.SeatCategories.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            q = q.Where(x => x.Name.Contains(request.Search));
        }

        if (request.OnlyEnabled is not null)
            q = q.Where(x => x.IsEnabled == request.OnlyEnabled);

        // ThenBy(Id) makes the order stable (Name is not unique in the database), so paging never skips or repeats rows.
        var projectedQuery = q.OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Select(x => new ListSeatCategoriesQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                ColorHex = x.ColorHex,
                IsEnabled = x.IsEnabled
            });

        return await PageResult<ListSeatCategoriesQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}