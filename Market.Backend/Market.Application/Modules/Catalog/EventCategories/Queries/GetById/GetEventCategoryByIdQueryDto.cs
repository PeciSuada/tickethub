namespace Market.Application.Modules.Catalog.EventCategories.Queries.GetById;

public class GetEventCategoryByIdQueryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required bool IsEnabled { get; init; }
}
