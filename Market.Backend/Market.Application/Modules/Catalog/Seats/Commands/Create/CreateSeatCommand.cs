namespace Market.Application.Modules.Catalog.Seats.Commands.Create;

public class CreateSeatCommand : IRequest<int>
{
    public int SectorId { get; set; }
    public int SeatCategoryId { get; set; }
    public required string RowLabel { get; set; }
    public int Number { get; set; }

    /// <summary>
    /// New seats are enabled unless the client sends <c>false</c>.
    /// </summary>
    public bool IsEnabled { get; set; } = true;
}