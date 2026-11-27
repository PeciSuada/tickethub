namespace Market.Application.Modules.Catalog.Sectors.Commands.Status.Disable;

public sealed class DisableSectorCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
