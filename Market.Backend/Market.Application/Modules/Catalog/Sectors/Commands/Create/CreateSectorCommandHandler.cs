namespace Market.Application.Modules.Catalog.Sectors.Commands.Create;

public class CreateSectorCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateSectorCommand, int>
{
    public async Task<int> Handle(CreateSectorCommand request, CancellationToken cancellationToken)
    {
        // Input format (required fields, max lengths) is checked by CreateSectorCommandValidator.
        var name = request.Name.Trim();

        bool venueExists = await context.Venues
            .AnyAsync(v => v.Id == request.VenueId, cancellationToken);

        if (!venueExists)
        {
            throw new MarketNotFoundException($"Dvorana (ID={request.VenueId}) nije prona\u0111ena.");
        }

        // The same sector name is allowed in different venues, but not twice in the same venue.
        bool exists = await context.Sectors
            .AnyAsync(x => x.VenueId == request.VenueId && x.Name.ToLower() == name.ToLower(), cancellationToken);

        if (exists)
        {
            throw new MarketConflictException($"Sektor sa nazivom {name} ve\u0107 postoji u ovoj dvorani.");
        }

        var sector = new SectorEntity
        {
            Name = name,
            VenueId = request.VenueId,
            IsEnabled = request.IsEnabled
        };

        context.Sectors.Add(sector);
        await context.SaveChangesAsync(cancellationToken);

        return sector.Id;
    }
}