namespace Market.Application.Modules.Catalog.Seats.Queries.GetById;

public class GetSeatByIdQuery : IRequest<GetSeatByIdQueryDto>
{
    public int Id { get; set; }
}