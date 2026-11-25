namespace Market.Application.Modules.Catalog.Cities.Commands.Update;

public sealed class UpdateCityCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string Name { get; set; }
    public required bool IsEnabled { get; set; }
}
