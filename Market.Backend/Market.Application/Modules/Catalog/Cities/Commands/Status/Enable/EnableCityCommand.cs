namespace Market.Application.Modules.Catalog.Cities.Commands.Status.Enable;

public sealed class EnableCityCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
