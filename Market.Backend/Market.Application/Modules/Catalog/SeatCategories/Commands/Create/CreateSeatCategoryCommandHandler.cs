namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Create;

public class CreateSeatCategoryCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateSeatCategoryCommand, int>
{
    public async Task<int> Handle(CreateSeatCategoryCommand request, CancellationToken cancellationToken)
    {
        // Input format (required fields, max length, color pattern) is checked by CreateSeatCategoryCommandValidator.
        var name = request.Name.Trim();

        bool exists = await context.SeatCategories
            .AnyAsync(x => x.Name.ToLower() == name.ToLower(), cancellationToken);

        if (exists)
        {
            throw new MarketConflictException($"Kategorija sjedi\u0161ta sa nazivom {name} ve\u0107 postoji.");
        }

        var category = new SeatCategoryEntity
        {
            Name = name,
            ColorHex = request.ColorHex.ToUpperInvariant(),
            IsEnabled = request.IsEnabled
        };

        context.SeatCategories.Add(category);
        await context.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}