namespace Market.Application.Modules.Catalog.EventCategories.Commands.Status.Disable;

public sealed class DisableEventCategoryCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DisableEventCategoryCommand, Unit>
{
    public async Task<Unit> Handle(DisableEventCategoryCommand request, CancellationToken ct)
    {
        var cat = await ctx.EventCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (cat is null)
        {
            throw new MarketNotFoundException($"Kategorija (ID={request.Id}) nije pronađena.");
        }

        if (!cat.IsEnabled) return Unit.Value; // idempotent

        cat.IsEnabled = false;

        await ctx.SaveChangesAsync(ct);

        // await _bus.PublishAsync(new EventCategoryDisabledV1IntegrationEvent(cat.Id, ...), ct);
        // await _cache.RemoveAsync(CacheKeys.CategoriesList, ct);

        return Unit.Value;
    }
}