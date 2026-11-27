namespace Market.Application.Modules.Catalog.Sectors.Queries.GetById;

public sealed class GetSectorByIdQueryValidator : AbstractValidator<GetSectorByIdQuery>
{
    public GetSectorByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id mora biti pozitivan broj.");
    }
}