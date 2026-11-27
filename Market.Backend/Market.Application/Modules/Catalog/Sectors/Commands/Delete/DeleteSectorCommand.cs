namespace Market.Application.Modules.Catalog.Sectors.Commands.Delete;

public class DeleteSectorCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
