namespace Market.Application.Modules.Catalog.Venues.Commands.Create;

public class CreateVenueCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateVenueCommand, int>
{
    public async Task<int> Handle(CreateVenueCommand request, CancellationToken cancellationToken)
    {
        // Input format (required fields, max lengths) is checked by CreateVenueCommandValidator.
        var name = request.Name.Trim();
        var address = request.Address.Trim();

        bool cityExists = await context.Cities
            .AnyAsync(c => c.Id == request.CityId, cancellationToken);

        if (!cityExists)
        {
            throw new MarketNotFoundException($"Grad (ID={request.CityId}) nije prona\u0111en.");
        }

        // The same venue name is allowed in different cities, but not twice in the same city.
        bool exists = await context.Venues
            .AnyAsync(x => x.CityId == request.CityId && x.Name.ToLower() == name.ToLower(), cancellationToken);

        if (exists)
        {
            throw new MarketConflictException($"Dvorana sa nazivom {name} ve\u0107 postoji u ovom gradu.");
        }

        var venue = new VenueEntity
        {
            Name = name,
            Address = address,
            CityId = request.CityId,
            IsEnabled = request.IsEnabled
        };

        context.Venues.Add(venue);
        await context.SaveChangesAsync(cancellationToken);

        return venue.Id;
    }
}