namespace Market.Application.Modules.Catalog.Seats.Queries.GetById;

public class GetSeatByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetSeatByIdQuery, GetSeatByIdQueryDto>
{
    public async Task<GetSeatByIdQueryDto> Handle(GetSeatByIdQuery request, CancellationToken cancellationToken)
    {
        var seat = await context.Seats
            .Where(s => s.Id == request.Id)
            .Select(x => new GetSeatByIdQueryDto
            {
                Id = x.Id,
                Name = x.RowLabel + x.Number.ToString(),
                RowLabel = x.RowLabel,
                Number = x.Number,
                SectorId = x.SectorId,
                SectorName = x.Sector.Name,
                SeatCategoryId = x.SeatCategoryId,
                SeatCategoryName = x.SeatCategory.Name,
                IsEnabled = x.IsEnabled
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (seat == null)
        {
            throw new MarketNotFoundException($"Sjedi\u0161te (ID={request.Id}) nije prona\u0111eno.");
        }

        return seat;
    }
}