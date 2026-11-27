namespace Market.Application.Modules.Catalog.Sectors.Commands.Status.Enable;

public sealed class EnableSectorCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
