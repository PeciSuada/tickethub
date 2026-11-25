namespace Market.Application.Modules.Catalog.EventCategories.Commands.Update;

public sealed class UpdateEventCategoryCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string Name { get; set; }
    public required bool IsEnabled { get; set; }
}
