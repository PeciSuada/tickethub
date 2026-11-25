namespace Market.Application.Modules.Catalog.Venues.Commands.Status.Enable;

public sealed class EnableVenueCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
