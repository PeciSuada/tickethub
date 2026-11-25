namespace Market.Application.Modules.Catalog.Cities.Commands.Delete;

public class DeleteCityCommandHandler(IAppDbContext context, IAppCurrentUser appCurrentUser)
      : IRequestHandler<DeleteCityCommand, Unit>
{
    public async Task<Unit> Handle(DeleteCityCommand request, CancellationToken cancellationToken)
    {
        // Defense in depth: the endpoint is already protected by the "Admin" policy.
        if (!appCurrentUser.IsAdmin)
            throw new MarketForbiddenException("Samo administrator može brisati gradove.");

        var city = await context.Cities
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (city is null)
            throw new MarketNotFoundException("Grad nije pronađen.");

        var hasVenues = await context.Venues
            .AnyAsync(v => v.CityId == city.Id, cancellationToken);

        if (hasVenues)
            throw new MarketConflictException(
                $"Grad {city.Name} se ne mo\u017ee obrisati jer ima dvorane. Prvo obri\u0161ite ili premjestite dvorane.");

        context.Cities.Remove(city);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
