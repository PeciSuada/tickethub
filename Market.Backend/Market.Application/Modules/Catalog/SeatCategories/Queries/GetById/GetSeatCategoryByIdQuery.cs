namespace Market.Application.Modules.Catalog.SeatCategories.Queries.GetById;

public class GetSeatCategoryByIdQuery : IRequest<GetSeatCategoryByIdQueryDto>
{
    public int Id { get; set; }
}