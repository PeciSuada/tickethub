namespace Market.Application.Modules.Catalog.Seats.Commands.Status.Enable;

public sealed class EnableSeatCommandHandler(IAppDbContext ctx)
    : IRequestHandler<EnableSeatCommand, Unit>
{
    public async Task<Unit> Handle(EnableSeatCommand request, CancellationToken ct)
    {
        var entity = await ctx.Seats
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Sjedište (ID={request.Id}) nije pronađeno.");

        if (!entity.IsEnabled)
        {
            entity.IsEnabled = true;
            await ctx.SaveChangesAsync(ct);
        }

        // If already enabled — nothing changes, idempotent
        return Unit.Value;
    }
}