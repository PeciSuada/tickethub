namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Status.Enable;

public sealed class EnableSeatCategoryCommandValidator : AbstractValidator<EnableSeatCategoryCommand>
{
    public EnableSeatCategoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
