namespace Market.Application.Modules.Catalog.Seats.Commands.Create;

public class CreateSeatCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateSeatCommand, int>
{
    public async Task<int> Handle(CreateSeatCommand request, CancellationToken cancellationToken)
    {
        // Input format is checked by CreateSeatCommandValidator.
        var rowLabel = request.RowLabel.Trim().ToUpperInvariant();

        bool sectorExists = await context.Sectors
            .AnyAsync(s => s.Id == request.SectorId, cancellationToken);

        if (!sectorExists)
        {
            throw new MarketNotFoundException($"Sektor (ID={request.SectorId}) nije prona\u0111en.");
        }

        bool categoryExists = await context.SeatCategories
            .AnyAsync(c => c.Id == request.SeatCategoryId, cancellationToken);

        if (!categoryExists)
        {
            throw new MarketNotFoundException($"Kategorija sjedi\u0161ta (ID={request.SeatCategoryId}) nije prona\u0111ena.");
        }

        // One physical seat exists only once: (sector, row, number). The database has a unique index too.
        bool exists = await context.Seats
            .AnyAsync(x => x.SectorId == request.SectorId && x.RowLabel == rowLabel && x.Number == request.Number, cancellationToken);

        if (exists)
        {
            throw new MarketConflictException($"Sjedi\u0161te {rowLabel}{request.Number} ve\u0107 postoji u ovom sektoru.");
        }

        var seat = new SeatEntity
        {
            SectorId = request.SectorId,
            SeatCategoryId = request.SeatCategoryId,
            RowLabel = rowLabel,
            Number = request.Number,
            IsEnabled = request.IsEnabled
        };

        context.Seats.Add(seat);
        await context.SaveChangesAsync(cancellationToken);

        return seat.Id;
    }
}