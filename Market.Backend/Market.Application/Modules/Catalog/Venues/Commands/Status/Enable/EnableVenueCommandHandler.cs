namespace Market.Application.Modules.Catalog.Venues.Commands.Status.Enable;

public sealed class EnableVenueCommandHandler(IAppDbContext ctx)
    : IRequestHandler<EnableVenueCommand, Unit>
{
    public async Task<Unit> Handle(EnableVenueCommand request, CancellationToken ct)
    {
        var entity = await ctx.Venues
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Dvorana (ID={request.Id}) nije pronađena.");

        if (!entity.IsEnabled)
        {
            entity.IsEnabled = true;
            await ctx.SaveChangesAsync(ct);
        }

        // If already enabled — nothing changes, idempotent
        return Unit.Value;
    }
}