namespace Market.Application.Modules.Catalog.Venues.Queries.List;

public sealed class ListVenuesQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListVenuesQuery, PageResult<ListVenuesQueryDto>>
{
    public async Task<PageResult<ListVenuesQueryDto>> Handle(
        ListVenuesQuery request, CancellationToken ct)
    {
        var q = ctx.Venues.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            q = q.Where(x => x.Name.Contains(request.Search) || x.Address.Contains(request.Search));
        }

        if (request.CityId is not null)
            q = q.Where(x => x.CityId == request.CityId);

        if (request.OnlyEnabled is not null)
            q = q.Where(x => x.IsEnabled == request.OnlyEnabled);

        // ThenBy(Id) makes the order stable (Name is not unique), so paging never skips or repeats rows.
        var projectedQuery = q.OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Select(x => new ListVenuesQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
                CityId = x.CityId,
                CityName = x.City.Name,
                IsEnabled = x.IsEnabled
            });

        return await PageResult<ListVenuesQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}