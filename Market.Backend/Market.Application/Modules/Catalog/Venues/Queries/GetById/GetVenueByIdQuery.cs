namespace Market.Application.Modules.Catalog.Venues.Queries.GetById;

public class GetVenueByIdQuery : IRequest<GetVenueByIdQueryDto>
{
    public int Id { get; set; }
}