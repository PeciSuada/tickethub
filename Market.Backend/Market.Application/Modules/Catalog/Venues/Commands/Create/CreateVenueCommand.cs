namespace Market.Application.Modules.Catalog.Venues.Commands.Create;

public class CreateVenueCommand : IRequest<int>
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public int CityId { get; set; }

    /// <summary>
    /// New venues are enabled unless the client sends <c>false</c>.
    /// </summary>
    public bool IsEnabled { get; set; } = true;
}