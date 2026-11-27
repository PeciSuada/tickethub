namespace Market.Application.Modules.Catalog.Seats.Commands.Update;

public sealed class UpdateSeatCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateSeatCommand, Unit>
{
    public async Task<Unit> Handle(UpdateSeatCommand request, CancellationToken ct)
    {
        var entity = await ctx.Seats
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Sjedi\u0161te (ID={request.Id}) nije prona\u0111eno.");

        var rowLabel = request.RowLabel.Trim().ToUpperInvariant();

        bool sectorExists = await ctx.Sectors.AnyAsync(s => s.Id == request.SectorId, ct);

        if (!sectorExists)
            throw new MarketNotFoundException($"Sektor (ID={request.SectorId}) nije prona\u0111en.");

        bool categoryExists = await ctx.SeatCategories.AnyAsync(c => c.Id == request.SeatCategoryId, ct);

        if (!categoryExists)
            throw new MarketNotFoundException($"Kategorija sjedi\u0161ta (ID={request.SeatCategoryId}) nije prona\u0111ena.");

        // Same seat position (sector, row, number) in another record is a duplicate.
        var exists = await ctx.Seats
            .AnyAsync(x => x.Id != request.Id && x.SectorId == request.SectorId && x.RowLabel == rowLabel && x.Number == request.Number, ct);

        if (exists)
        {
            throw new MarketConflictException($"Sjedi\u0161te {rowLabel}{request.Number} ve\u0107 postoji u ovom sektoru.");
        }

        entity.SectorId = request.SectorId;
        entity.SeatCategoryId = request.SeatCategoryId;
        entity.RowLabel = rowLabel;
        entity.Number = request.Number;
        entity.IsEnabled = request.IsEnabled;

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}