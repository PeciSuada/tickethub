namespace Market.Application.Modules.Catalog.EventCategories.Commands.Status.Enable;

public sealed class EnableEventCategoryCommandHandler(IAppDbContext ctx)
    : IRequestHandler<EnableEventCategoryCommand, Unit>
{
    public async Task<Unit> Handle(EnableEventCategoryCommand request, CancellationToken ct)
    {
        var entity = await ctx.EventCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Kategorija (ID={request.Id}) nije pronađena.");

        if (!entity.IsEnabled)
        {
            entity.IsEnabled = true;
            await ctx.SaveChangesAsync(ct);
        }

        // If already enabled — nothing changes, idempotent
        return Unit.Value;
    }
}