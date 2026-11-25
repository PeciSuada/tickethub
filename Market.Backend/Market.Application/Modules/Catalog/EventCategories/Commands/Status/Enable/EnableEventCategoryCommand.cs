namespace Market.Application.Modules.Catalog.EventCategories.Commands.Status.Enable;

public sealed class EnableEventCategoryCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
