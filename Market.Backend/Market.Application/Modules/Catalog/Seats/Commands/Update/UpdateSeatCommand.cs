namespace Market.Application.Modules.Catalog.Seats.Commands.Update;

public sealed class UpdateSeatCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public int SectorId { get; set; }
    public int SeatCategoryId { get; set; }
    public required string RowLabel { get; set; }
    public int Number { get; set; }
    public required bool IsEnabled { get; set; }
}