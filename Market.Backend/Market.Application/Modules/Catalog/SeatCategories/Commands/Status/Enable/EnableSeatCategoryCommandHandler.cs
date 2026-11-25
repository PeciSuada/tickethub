namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Status.Enable;

public sealed class EnableSeatCategoryCommandHandler(IAppDbContext ctx)
    : IRequestHandler<EnableSeatCategoryCommand, Unit>
{
    public async Task<Unit> Handle(EnableSeatCategoryCommand request, CancellationToken ct)
    {
        var entity = await ctx.SeatCategories
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Kategorija sjedišta (ID={request.Id}) nije pronađena.");

        if (!entity.IsEnabled)
        {
            entity.IsEnabled = true;
            await ctx.SaveChangesAsync(ct);
        }

        // If already enabled — nothing changes, idempotent
        return Unit.Value;
    }
}