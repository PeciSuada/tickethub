namespace Market.Application.Modules.Catalog.EventCategories.Commands.Update;

public sealed class UpdateEventCategoryCommandHandler(IAppDbContext ctx)
            : IRequestHandler<UpdateEventCategoryCommand, Unit>
{
    public async Task<Unit> Handle(UpdateEventCategoryCommand request, CancellationToken ct)
    {
        var entity = await ctx.EventCategories
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Kategorija (ID={request.Id}) nije pronađena.");

        var normalized = request.Name.Trim();

        // Check for duplicate name (case-insensitive, except for the same ID)
        var exists = await ctx.EventCategories
            .AnyAsync(x => x.Id != request.Id && x.Name.ToLower() == normalized.ToLower(), ct);

        if (exists)
        {
            throw new MarketConflictException($"Kategorija sa nazivom {normalized} već postoji.");
        }

        entity.Name = normalized;
        entity.IsEnabled = request.IsEnabled;

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
