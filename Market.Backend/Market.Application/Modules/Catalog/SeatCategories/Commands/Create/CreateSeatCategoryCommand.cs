namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Create;

public class CreateSeatCategoryCommand : IRequest<int>
{
    public required string Name { get; set; }
    public required string ColorHex { get; set; }

    /// <summary>
    /// New seat categories are enabled unless the client sends <c>false</c>.
    /// </summary>
    public bool IsEnabled { get; set; } = true;
}