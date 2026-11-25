namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Update;

public sealed class UpdateSeatCategoryCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateSeatCategoryCommand, Unit>
{
    public async Task<Unit> Handle(UpdateSeatCategoryCommand request, CancellationToken ct)
    {
        var entity = await ctx.SeatCategories
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Kategorija sjedi\u0161ta (ID={request.Id}) nije prona\u0111ena.");

        var name = request.Name.Trim();

        // Duplicate name (case-insensitive), except for the same category.
        var exists = await ctx.SeatCategories
            .AnyAsync(x => x.Id != request.Id && x.Name.ToLower() == name.ToLower(), ct);

        if (exists)
        {
            throw new MarketConflictException($"Kategorija sjedi\u0161ta sa nazivom {name} ve\u0107 postoji.");
        }

        entity.Name = name;
        entity.ColorHex = request.ColorHex.ToUpperInvariant();
        entity.IsEnabled = request.IsEnabled;

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}