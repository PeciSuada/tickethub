namespace Market.Application.Modules.Catalog.Venues.Commands.Delete;

public class DeleteVenueCommandHandler(IAppDbContext context, IAppCurrentUser appCurrentUser)
      : IRequestHandler<DeleteVenueCommand, Unit>
{
    public async Task<Unit> Handle(DeleteVenueCommand request, CancellationToken cancellationToken)
    {
        // Defense in depth: the endpoint is already protected by the "Admin" policy.
        if (!appCurrentUser.IsAdmin)
            throw new MarketForbiddenException("Samo administrator može brisati dvorane.");

        var venue = await context.Venues
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (venue is null)
            throw new MarketNotFoundException("Dvorana nije pronađena.");

        context.Venues.Remove(venue);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
