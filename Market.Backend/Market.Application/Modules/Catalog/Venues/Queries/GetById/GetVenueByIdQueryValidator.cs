namespace Market.Application.Modules.Catalog.Venues.Queries.GetById;

public sealed class GetVenueByIdQueryValidator : AbstractValidator<GetVenueByIdQuery>
{
    public GetVenueByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id mora biti pozitivan broj.");
    }
}