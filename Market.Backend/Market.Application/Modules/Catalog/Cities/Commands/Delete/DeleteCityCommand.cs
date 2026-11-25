namespace Market.Application.Modules.Catalog.Cities.Commands.Delete;

public class DeleteCityCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
