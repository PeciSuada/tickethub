namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Status.Enable;

public sealed class EnableSeatCategoryCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
