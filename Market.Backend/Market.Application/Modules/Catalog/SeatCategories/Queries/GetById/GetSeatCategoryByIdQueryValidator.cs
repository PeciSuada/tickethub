namespace Market.Application.Modules.Catalog.SeatCategories.Queries.GetById;

public sealed class GetSeatCategoryByIdQueryValidator : AbstractValidator<GetSeatCategoryByIdQuery>
{
    public GetSeatCategoryByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id mora biti pozitivan broj.");
    }
}