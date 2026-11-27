namespace Market.Application.Modules.Catalog.Sectors.Queries.List;

public sealed class ListSectorsQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListSectorsQuery, PageResult<ListSectorsQueryDto>>
{
    public async Task<PageResult<ListSectorsQueryDto>> Handle(
        ListSectorsQuery request, CancellationToken ct)
    {
        var q = ctx.Sectors.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            q = q.Where(x => x.Name.Contains(request.Search));
        }

        if (request.VenueId is not null)
            q = q.Where(x => x.VenueId == request.VenueId);

        if (request.OnlyEnabled is not null)
            q = q.Where(x => x.IsEnabled == request.OnlyEnabled);

        // ThenBy(Id) makes the order stable (Name is not unique), so paging never skips or repeats rows.
        var projectedQuery = q.OrderBy(x => x.Venue.Name)
            .ThenBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Select(x => new ListSectorsQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                VenueId = x.VenueId,
                VenueName = x.Venue.Name,
                SeatCount = ctx.Seats.Count(s => s.SectorId == x.Id),
                IsEnabled = x.IsEnabled
            });

        return await PageResult<ListSectorsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}