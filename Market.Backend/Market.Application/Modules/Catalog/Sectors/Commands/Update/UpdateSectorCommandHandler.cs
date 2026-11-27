namespace Market.Application.Modules.Catalog.Sectors.Commands.Update;

public sealed class UpdateSectorCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateSectorCommand, Unit>
{
    public async Task<Unit> Handle(UpdateSectorCommand request, CancellationToken ct)
    {
        var entity = await ctx.Sectors
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Sektor (ID={request.Id}) nije prona\u0111en.");

        var name = request.Name.Trim();

        bool venueExists = await ctx.Venues.AnyAsync(v => v.Id == request.VenueId, ct);

        if (!venueExists)
            throw new MarketNotFoundException($"Dvorana (ID={request.VenueId}) nije prona\u0111ena.");

        // Duplicate name inside the same venue (case-insensitive), except for the same sector.
        var exists = await ctx.Sectors
            .AnyAsync(x => x.Id != request.Id && x.VenueId == request.VenueId && x.Name.ToLower() == name.ToLower(), ct);

        if (exists)
        {
            throw new MarketConflictException($"Sektor sa nazivom {name} ve\u0107 postoji u ovoj dvorani.");
        }

        entity.Name = name;
        entity.VenueId = request.VenueId;
        entity.IsEnabled = request.IsEnabled;

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}