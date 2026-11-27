namespace Market.Application.Modules.Catalog.Seats.Commands.Generate;

/// <summary>
/// Creates seats for several rows at once: rows FirstRow, FirstRow+1, ... (A, B, C, ...),
/// each row with SeatsPerRow seats numbered 1..SeatsPerRow. All seats get the same seat category.
/// </summary>
public class GenerateSeatsCommand : IRequest<int>
{
    public int SectorId { get; set; }
    public int SeatCategoryId { get; set; }

    /// <summary>Letter of the first row, e.g. "A".</summary>
    public required string FirstRow { get; set; }
    public int RowCount { get; set; }
    public int SeatsPerRow { get; set; }
}