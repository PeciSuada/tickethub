namespace Market.Application.Modules.Catalog.Cities.Queries.GetById;

public class GetCityByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetCityByIdQuery, GetCityByIdQueryDto>
{
    public async Task<GetCityByIdQueryDto> Handle(GetCityByIdQuery request, CancellationToken cancellationToken)
    {
        var city = await context.Cities
            .Where(c => c.Id == request.Id)
            .Select(x => new GetCityByIdQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                IsEnabled = x.IsEnabled
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (city == null)
        {
            throw new MarketNotFoundException($"Grad (ID={request.Id}) nije pronađen.");
        }

        return city;
    }
}