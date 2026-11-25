namespace Market.Application.Modules.Catalog.Cities.Queries.List;

public sealed class ListCitiesQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListCitiesQuery, PageResult<ListCitiesQueryDto>>
{
    public async Task<PageResult<ListCitiesQueryDto>> Handle(
        ListCitiesQuery request, CancellationToken ct)
    {
        var q = ctx.Cities.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
             q = q.Where(x => x.Name.Contains(request.Search));
        }

        if (request.OnlyEnabled is not null)
            q = q.Where(x => x.IsEnabled == request.OnlyEnabled);

        // ThenBy(Id) makes the order stable (Name is not unique), so paging never skips or repeats rows.
        var projectedQuery = q.OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Select(x => new ListCitiesQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                IsEnabled = x.IsEnabled
            });

        return await PageResult<ListCitiesQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
