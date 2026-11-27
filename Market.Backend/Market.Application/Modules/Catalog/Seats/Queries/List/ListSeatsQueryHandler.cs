namespace Market.Application.Modules.Catalog.Seats.Queries.List;

public sealed class ListSeatsQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListSeatsQuery, PageResult<ListSeatsQueryDto>>
{
    public async Task<PageResult<ListSeatsQueryDto>> Handle(
        ListSeatsQuery request, CancellationToken ct)
    {
        var q = ctx.Seats.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            q = q.Where(x => x.RowLabel.Contains(search));
        }

        if (request.SectorId is not null)
            q = q.Where(x => x.SectorId == request.SectorId);

        if (request.SeatCategoryId is not null)
            q = q.Where(x => x.SeatCategoryId == request.SeatCategoryId);

        if (request.OnlyEnabled is not null)
            q = q.Where(x => x.IsEnabled == request.OnlyEnabled);

        // ThenBy(Id) makes the order stable, so paging never skips or repeats rows.
        var projectedQuery = q.OrderBy(x => x.Sector.Venue.Name)
            .ThenBy(x => x.Sector.Name)
            .ThenBy(x => x.RowLabel)
            .ThenBy(x => x.Number)
            .ThenBy(x => x.Id)
            .Select(x => new ListSeatsQueryDto
            {
                Id = x.Id,
                Name = x.RowLabel + x.Number.ToString(),
                RowLabel = x.RowLabel,
                Number = x.Number,
                SectorId = x.SectorId,
                SectorName = x.Sector.Name,
                VenueName = x.Sector.Venue.Name,
                SeatCategoryId = x.SeatCategoryId,
                SeatCategoryName = x.SeatCategory.Name,
                SeatCategoryColorHex = x.SeatCategory.ColorHex,
                IsEnabled = x.IsEnabled
            });

        return await PageResult<ListSeatsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}