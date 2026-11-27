namespace Market.Application.Modules.Catalog.Sectors.Queries.GetById;

public class GetSectorByIdQuery : IRequest<GetSectorByIdQueryDto>
{
    public int Id { get; set; }
}