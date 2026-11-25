namespace Market.Application.Modules.Catalog.EventCategories.Commands.Create;

public class CreateEventCategoryCommand : IRequest<int>
{
    public required string Name { get; set; }

    /// <summary>
    /// New categories are enabled unless the client sends <c>false</c>.
    /// </summary>
    public bool IsEnabled { get; set; } = true;
}
