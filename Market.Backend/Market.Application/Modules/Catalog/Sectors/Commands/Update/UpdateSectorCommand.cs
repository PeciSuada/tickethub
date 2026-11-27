namespace Market.Application.Modules.Catalog.Sectors.Commands.Update;

public sealed class UpdateSectorCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string Name { get; set; }
    public int VenueId { get; set; }
    public required bool IsEnabled { get; set; }
}