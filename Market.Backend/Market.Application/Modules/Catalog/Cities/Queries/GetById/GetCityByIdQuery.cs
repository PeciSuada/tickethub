namespace Market.Application.Modules.Catalog.Cities.Queries.GetById;

public class GetCityByIdQuery : IRequest<GetCityByIdQueryDto>
{
    public int Id { get; set; }
}