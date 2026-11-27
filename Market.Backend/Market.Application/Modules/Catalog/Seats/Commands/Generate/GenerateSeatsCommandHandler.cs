namespace Market.Application.Modules.Catalog.Seats.Commands.Generate;

public class GenerateSeatsCommandHandler(IAppDbContext context)
    : IRequestHandler<GenerateSeatsCommand, int>
{
    public async Task<int> Handle(GenerateSeatsCommand request, CancellationToken cancellationToken)
    {
        // Input format is checked by GenerateSeatsCommandValidator.
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

        char first = char.ToUpperInvariant(request.FirstRow.Trim()[0]);
        var rowLabels = Enumerable.Range(0, request.RowCount)
            .Select(i => ((char)(first + i)).ToString())
            .ToList();

        // If any of these rows already has seats in this sector, nothing is created (all or nothing).
        var existingRows = await context.Seats
            .Where(x => x.SectorId == request.SectorId && rowLabels.Contains(x.RowLabel))
            .Select(x => x.RowLabel)
            .Distinct()
            .ToListAsync(cancellationToken);

        if (existingRows.Count > 0)
        {
            throw new MarketConflictException(
                $"U ovom sektoru ve\u0107 postoje sjedi\u0161ta u redovima: {string.Join(", ", existingRows.OrderBy(r => r))}.");
        }

        var seats = new List<SeatEntity>(request.RowCount * request.SeatsPerRow);
        foreach (var row in rowLabels)
        {
            for (int number = 1; number <= request.SeatsPerRow; number++)
            {
                seats.Add(new SeatEntity
                {
                    SectorId = request.SectorId,
                    SeatCategoryId = request.SeatCategoryId,
                    RowLabel = row,
                    Number = number,
                    IsEnabled = true
                });
            }
        }

        // One SaveChanges = one database transaction: either all seats are created or none.
        context.Seats.AddRange(seats);
        await context.SaveChangesAsync(cancellationToken);

        return seats.Count;
    }
}