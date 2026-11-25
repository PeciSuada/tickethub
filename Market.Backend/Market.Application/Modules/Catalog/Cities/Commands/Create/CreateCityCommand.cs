namespace Market.Application.Modules.Catalog.Cities.Commands.Create;

public class CreateCityCommand : IRequest<int>
{
    public required string Name { get; set; }

    /// <summary>
    /// New cities are enabled unless the client sends <c>false</c>.
    /// </summary>
    public bool IsEnabled { get; set; } = true;
}
