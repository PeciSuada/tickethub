namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Status.Disable;

public sealed class DisableSeatCategoryCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
