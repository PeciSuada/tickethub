namespace Market.Application.Modules.Catalog.Venues.Commands.Delete;

public class DeleteVenueCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
