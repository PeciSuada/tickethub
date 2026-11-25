namespace Market.Application.Modules.Catalog.Venues.Commands.Status.Disable;

public sealed class DisableVenueCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
