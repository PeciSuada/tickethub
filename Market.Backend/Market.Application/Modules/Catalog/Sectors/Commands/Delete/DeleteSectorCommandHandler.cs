namespace Market.Application.Modules.Catalog.Sectors.Commands.Delete;

public class DeleteSectorCommandHandler(IAppDbContext context, IAppCurrentUser appCurrentUser)
      : IRequestHandler<DeleteSectorCommand, Unit>
{
    public async Task<Unit> Handle(DeleteSectorCommand request, CancellationToken cancellationToken)
    {
        // Defense in depth: the endpoint is already protected by the "Admin" policy.
        if (!appCurrentUser.IsAdmin)
            throw new MarketForbiddenException("Samo administrator može brisati sektore.");

        var sector = await context.Sectors
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (sector is null)
            throw new MarketNotFoundException("Sektor nije pronađen.");

        var hasSeats = await context.Seats
            .AnyAsync(s => s.SectorId == sector.Id, cancellationToken);

        if (hasSeats)
            throw new MarketConflictException(
                $"Sektor {sector.Name} se ne mo\u017ee obrisati jer ima sjedi\u0161ta. Prvo obri\u0161ite sjedi\u0161ta.");

        context.Sectors.Remove(sector);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
