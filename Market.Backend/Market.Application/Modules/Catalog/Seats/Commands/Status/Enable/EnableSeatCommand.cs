namespace Market.Application.Modules.Catalog.Seats.Commands.Status.Enable;

public sealed class EnableSeatCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
