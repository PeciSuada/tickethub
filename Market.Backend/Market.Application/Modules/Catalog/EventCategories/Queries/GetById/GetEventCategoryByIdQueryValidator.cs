namespace Market.Application.Modules.Catalog.EventCategories.Queries.GetById;

public sealed class GetEventCategoryByIdQueryValidator : AbstractValidator<GetEventCategoryByIdQuery>
{
    public GetEventCategoryByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id mora biti pozitivan broj.");
    }
}