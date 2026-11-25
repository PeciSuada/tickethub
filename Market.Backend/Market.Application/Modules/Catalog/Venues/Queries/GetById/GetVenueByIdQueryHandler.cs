namespace Market.Application.Modules.Catalog.Venues.Queries.GetById;

public class GetVenueByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetVenueByIdQuery, GetVenueByIdQueryDto>
{
    public async Task<GetVenueByIdQueryDto> Handle(GetVenueByIdQuery request, CancellationToken cancellationToken)
    {
        var venue = await context.Venues
            .Where(v => v.Id == request.Id)
            .Select(x => new GetVenueByIdQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
                CityId = x.CityId,
                CityName = x.City.Name,
                IsEnabled = x.IsEnabled
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (venue == null)
        {
            throw new MarketNotFoundException($"Dvorana (ID={request.Id}) nije prona\u0111ena.");
        }

        return venue;
    }
}