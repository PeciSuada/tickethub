namespace Market.Application.Modules.Catalog.Venues.Commands.Update;

public sealed class UpdateVenueCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateVenueCommand, Unit>
{
    public async Task<Unit> Handle(UpdateVenueCommand request, CancellationToken ct)
    {
        var entity = await ctx.Venues
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Dvorana (ID={request.Id}) nije prona\u0111ena.");

        var name = request.Name.Trim();
        var address = request.Address.Trim();

        bool cityExists = await ctx.Cities.AnyAsync(c => c.Id == request.CityId, ct);

        if (!cityExists)
            throw new MarketNotFoundException($"Grad (ID={request.CityId}) nije prona\u0111en.");

        // Duplicate name inside the same city (case-insensitive), except for the same venue.
        var exists = await ctx.Venues
            .AnyAsync(x => x.Id != request.Id && x.CityId == request.CityId && x.Name.ToLower() == name.ToLower(), ct);

        if (exists)
        {
            throw new MarketConflictException($"Dvorana sa nazivom {name} ve\u0107 postoji u ovom gradu.");
        }

        entity.Name = name;
        entity.Address = address;
        entity.CityId = request.CityId;
        entity.IsEnabled = request.IsEnabled;

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}