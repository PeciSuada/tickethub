namespace Market.Application.Modules.Catalog.Cities.Commands.Create;

public class CreateCityCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateCityCommand, int>
{
    public async Task<int> Handle(CreateCityCommand request, CancellationToken cancellationToken)
    {
        // Input format (required name, max length) is checked by CreateCityCommandValidator.
        var normalized = request.Name.Trim();

        // Check if a city with the same name already exists (case-insensitive).
        bool exists = await context.Cities
            .AnyAsync(x => x.Name.ToLower() == normalized.ToLower(), cancellationToken);

        if (exists)
        {
            throw new MarketConflictException($"Grad sa nazivom {normalized} već postoji.");
        }

        var city = new CityEntity
        {
            Name = normalized,
            IsEnabled = request.IsEnabled
        };

        context.Cities.Add(city);
        await context.SaveChangesAsync(cancellationToken);

        return city.Id;
    }
}
