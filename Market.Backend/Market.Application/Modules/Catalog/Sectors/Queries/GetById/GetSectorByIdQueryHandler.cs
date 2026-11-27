namespace Market.Application.Modules.Catalog.Sectors.Queries.GetById;

public class GetSectorByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetSectorByIdQuery, GetSectorByIdQueryDto>
{
    public async Task<GetSectorByIdQueryDto> Handle(GetSectorByIdQuery request, CancellationToken cancellationToken)
    {
        var sector = await context.Sectors
            .Where(s => s.Id == request.Id)
            .Select(x => new GetSectorByIdQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                VenueId = x.VenueId,
                VenueName = x.Venue.Name,
                IsEnabled = x.IsEnabled
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (sector == null)
        {
            throw new MarketNotFoundException($"Sektor (ID={request.Id}) nije prona\u0111en.");
        }

        return sector;
    }
}