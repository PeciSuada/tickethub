namespace Market.Application.Modules.Catalog.Seats.Commands.Delete;

public class DeleteSeatCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
