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

        var hasSectors = await context.Sectors
            .AnyAsync(s => s.VenueId == venue.Id, cancellationToken);

        if (hasSectors)
            throw new MarketConflictException(
                $"Dvorana {venue.Name} se ne mo\u017ee obrisati jer ima sektore. Prvo obri\u0161ite sektore.");

        context.Venues.Remove(venue);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
