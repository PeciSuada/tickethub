namespace Market.Application.Modules.Catalog.EventCategories.Queries.GetById;

public class GetEventCategoryByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetEventCategoryByIdQuery, GetEventCategoryByIdQueryDto>
{
    public async Task<GetEventCategoryByIdQueryDto> Handle(GetEventCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await context.EventCategories
            .Where(c => c.Id == request.Id)
            .Select(x => new GetEventCategoryByIdQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                IsEnabled = x.IsEnabled
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (category == null)
        {
            throw new MarketNotFoundException($"Kategorija (ID={request.Id}) nije pronađena.");
        }

        return category;
    }
}