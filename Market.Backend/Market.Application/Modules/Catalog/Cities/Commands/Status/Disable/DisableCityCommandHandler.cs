namespace Market.Application.Modules.Catalog.Cities.Commands.Status.Disable;

public sealed class DisableCityCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DisableCityCommand, Unit>
{
    public async Task<Unit> Handle(DisableCityCommand request, CancellationToken ct)
    {
        var cat = await ctx.Cities
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (cat is null)
        {
            throw new MarketNotFoundException($"Grad (ID={request.Id}) nije pronađen.");
        }

        if (!cat.IsEnabled) return Unit.Value; // idempotent

        cat.IsEnabled = false;

        await ctx.SaveChangesAsync(ct);

        // await _bus.PublishAsync(new CityDisabledV1IntegrationEvent(cat.Id, ...), ct);
        // await _cache.RemoveAsync(CacheKeys.CitiesList, ct);

        return Unit.Value;
    }
}