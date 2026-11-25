namespace Market.Application.Modules.Catalog.EventCategories.Queries.GetById;

public class GetEventCategoryByIdQuery : IRequest<GetEventCategoryByIdQueryDto>
{
    public int Id { get; set; }
}