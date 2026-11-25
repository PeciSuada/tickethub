namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Status.Disable;

public sealed class DisableSeatCategoryCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DisableSeatCategoryCommand, Unit>
{
    public async Task<Unit> Handle(DisableSeatCategoryCommand request, CancellationToken ct)
    {
        var cat = await ctx.SeatCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (cat is null)
        {
            throw new MarketNotFoundException($"Kategorija sjedišta (ID={request.Id}) nije pronađena.");
        }

        if (!cat.IsEnabled) return Unit.Value; // idempotent

        cat.IsEnabled = false;

        await ctx.SaveChangesAsync(ct);

        // await _bus.PublishAsync(new SeatCategoryDisabledV1IntegrationEvent(cat.Id, ...), ct);
        // await _cache.RemoveAsync(CacheKeys.CategoriesList, ct);

        return Unit.Value;
    }
}