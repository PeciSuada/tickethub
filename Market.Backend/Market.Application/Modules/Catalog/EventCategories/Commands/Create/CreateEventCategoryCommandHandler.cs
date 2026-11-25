namespace Market.Application.Modules.Catalog.EventCategories.Commands.Create;

public class CreateEventCategoryCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateEventCategoryCommand, int>
{
    public async Task<int> Handle(CreateEventCategoryCommand request, CancellationToken cancellationToken)
    {
        // Input format (required name, max length) is checked by CreateEventCategoryCommandValidator.
        var normalized = request.Name.Trim();

        // Check if a category with the same name already exists (case-insensitive).
        bool exists = await context.EventCategories
            .AnyAsync(x => x.Name.ToLower() == normalized.ToLower(), cancellationToken);

        if (exists)
        {
            throw new MarketConflictException($"Kategorija sa nazivom {normalized} već postoji.");
        }

        var category = new EventCategoryEntity
        {
            Name = normalized,
            IsEnabled = request.IsEnabled
        };

        context.EventCategories.Add(category);
        await context.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}
