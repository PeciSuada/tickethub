namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Status.Disable;

public sealed class DisableSeatCategoryCommandValidator : AbstractValidator<DisableSeatCategoryCommand>
{
    public DisableSeatCategoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
