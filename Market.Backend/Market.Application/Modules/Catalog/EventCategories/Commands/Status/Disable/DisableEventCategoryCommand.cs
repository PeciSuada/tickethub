namespace Market.Application.Modules.Catalog.EventCategories.Commands.Status.Disable;

public sealed class DisableEventCategoryCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
