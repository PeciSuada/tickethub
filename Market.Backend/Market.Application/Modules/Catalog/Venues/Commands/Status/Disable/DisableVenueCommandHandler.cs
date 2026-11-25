namespace Market.Application.Modules.Catalog.Venues.Commands.Status.Disable;

public sealed class DisableVenueCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DisableVenueCommand, Unit>
{
    public async Task<Unit> Handle(DisableVenueCommand request, CancellationToken ct)
    {
        var cat = await ctx.Venues
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (cat is null)
        {
            throw new MarketNotFoundException($"Dvorana (ID={request.Id}) nije pronađena.");
        }

        if (!cat.IsEnabled) return Unit.Value; // idempotent

        cat.IsEnabled = false;

        await ctx.SaveChangesAsync(ct);

        // await _bus.PublishAsync(new VenueDisabledV1IntegrationEvent(cat.Id, ...), ct);
        // await _cache.RemoveAsync(CacheKeys.VenuesList, ct);

        return Unit.Value;
    }
}