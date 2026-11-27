namespace Market.Application.Modules.Catalog.Seats.Commands.Status.Disable;

public sealed class DisableSeatCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
