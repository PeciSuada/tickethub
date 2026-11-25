namespace Market.Application.Modules.Catalog.Cities.Commands.Update;

public sealed class UpdateCityCommandHandler(IAppDbContext ctx)
            : IRequestHandler<UpdateCityCommand, Unit>
{
    public async Task<Unit> Handle(UpdateCityCommand request, CancellationToken ct)
    {
        var entity = await ctx.Cities
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Grad (ID={request.Id}) nije pronađen.");

        var normalized = request.Name.Trim();

        // Check for duplicate name (case-insensitive, except for the same ID)
        var exists = await ctx.Cities
            .AnyAsync(x => x.Id != request.Id && x.Name.ToLower() == normalized.ToLower(), ct);

        if (exists)
        {
            throw new MarketConflictException($"Grad sa nazivom {normalized} već postoji.");
        }

        entity.Name = normalized;
        entity.IsEnabled = request.IsEnabled;

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
