namespace Market.Application.Modules.Catalog.SeatCategories.Queries.GetById;

public class GetSeatCategoryByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetSeatCategoryByIdQuery, GetSeatCategoryByIdQueryDto>
{
    public async Task<GetSeatCategoryByIdQueryDto> Handle(GetSeatCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await context.SeatCategories
            .Where(c => c.Id == request.Id)
            .Select(x => new GetSeatCategoryByIdQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                ColorHex = x.ColorHex,
                IsEnabled = x.IsEnabled
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (category == null)
        {
            throw new MarketNotFoundException($"Kategorija sjedi\u0161ta (ID={request.Id}) nije prona\u0111ena.");
        }

        return category;
    }
}