namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Delete;

public class DeleteSeatCategoryCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
