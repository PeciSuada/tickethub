namespace Market.Application.Modules.Catalog.Cities.Queries.GetById;

public sealed class GetCityByIdQueryValidator : AbstractValidator<GetCityByIdQuery>
{
    public GetCityByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id mora biti pozitivan broj.");
    }
}