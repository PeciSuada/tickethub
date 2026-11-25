namespace Market.Application.Modules.Catalog.EventCategories.Commands.Delete;

public class DeleteEventCategoryCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
