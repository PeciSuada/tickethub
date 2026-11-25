namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Update;

public sealed class UpdateSeatCategoryCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string ColorHex { get; set; }
    public required bool IsEnabled { get; set; }
}