namespace Market.Application.Modules.Catalog.Sectors.Commands.Create;

public class CreateSectorCommand : IRequest<int>
{
    public required string Name { get; set; }
    public int VenueId { get; set; }

    /// <summary>
    /// New sectors are enabled unless the client sends <c>false</c>.
    /// </summary>
    public bool IsEnabled { get; set; } = true;
}