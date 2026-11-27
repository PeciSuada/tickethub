namespace Market.Application.Modules.Catalog.Sectors.Commands.Status.Enable;

public sealed class EnableSectorCommandHandler(IAppDbContext ctx)
    : IRequestHandler<EnableSectorCommand, Unit>
{
    public async Task<Unit> Handle(EnableSectorCommand request, CancellationToken ct)
    {
        var entity = await ctx.Sectors
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Sektor (ID={request.Id}) nije pronađen.");

        if (!entity.IsEnabled)
        {
            entity.IsEnabled = true;
            await ctx.SaveChangesAsync(ct);
        }

        // If already enabled — nothing changes, idempotent
        return Unit.Value;
    }
}