namespace Market.Application.Modules.Catalog.Seats.Queries.GetById;

public sealed class GetSeatByIdQueryValidator : AbstractValidator<GetSeatByIdQuery>
{
    public GetSeatByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id mora biti pozitivan broj.");
    }
}