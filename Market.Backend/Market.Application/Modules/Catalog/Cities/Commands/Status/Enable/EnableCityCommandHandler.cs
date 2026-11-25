namespace Market.Application.Modules.Catalog.Cities.Commands.Status.Enable;

public sealed class EnableCityCommandHandler(IAppDbContext ctx)
    : IRequestHandler<EnableCityCommand, Unit>
{
    public async Task<Unit> Handle(EnableCityCommand request, CancellationToken ct)
    {
        var entity = await ctx.Cities
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Grad (ID={request.Id}) nije pronađen.");

        if (!entity.IsEnabled)
        {
            entity.IsEnabled = true;
            await ctx.SaveChangesAsync(ct);
        }

        // If already enabled — nothing changes, idempotent
        return Unit.Value;
    }
}