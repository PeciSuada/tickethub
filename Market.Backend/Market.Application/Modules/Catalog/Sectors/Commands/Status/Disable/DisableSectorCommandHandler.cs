namespace Market.Application.Modules.Catalog.Sectors.Commands.Status.Disable;

public sealed class DisableSectorCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DisableSectorCommand, Unit>
{
    public async Task<Unit> Handle(DisableSectorCommand request, CancellationToken ct)
    {
        var cat = await ctx.Sectors
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (cat is null)
        {
            throw new MarketNotFoundException($"Sektor (ID={request.Id}) nije pronađen.");
        }

        if (!cat.IsEnabled) return Unit.Value; // idempotent

        cat.IsEnabled = false;

        await ctx.SaveChangesAsync(ct);

        // await _bus.PublishAsync(new SectorDisabledV1IntegrationEvent(cat.Id, ...), ct);
        // await _cache.RemoveAsync(CacheKeys.SectorsList, ct);

        return Unit.Value;
    }
}