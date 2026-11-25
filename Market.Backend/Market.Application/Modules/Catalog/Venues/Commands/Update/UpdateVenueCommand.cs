namespace Market.Application.Modules.Catalog.Venues.Commands.Update;

public sealed class UpdateVenueCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
    public int CityId { get; set; }
    public required bool IsEnabled { get; set; }
}