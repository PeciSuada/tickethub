namespace Market.Application.Modules.Catalog.Cities.Commands.Status.Disable;

public sealed class DisableCityCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
