namespace Market.Application.Modules.Catalog.Seats.Commands.Status.Disable;

public sealed class DisableSeatCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DisableSeatCommand, Unit>
{
    public async Task<Unit> Handle(DisableSeatCommand request, CancellationToken ct)
    {
        var cat = await ctx.Seats
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (cat is null)
        {
            throw new MarketNotFoundException($"Sjedište (ID={request.Id}) nije pronađeno.");
        }

        if (!cat.IsEnabled) return Unit.Value; // idempotent

        cat.IsEnabled = false;

        await ctx.SaveChangesAsync(ct);

        // await _bus.PublishAsync(new SeatDisabledV1IntegrationEvent(cat.Id, ...), ct);
        // await _cache.RemoveAsync(CacheKeys.SeatsList, ct);

        return Unit.Value;
    }
}