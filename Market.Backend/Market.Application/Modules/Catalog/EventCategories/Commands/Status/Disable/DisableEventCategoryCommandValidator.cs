namespace Market.Application.Modules.Catalog.EventCategories.Commands.Status.Disable;

public sealed class DisableEventCategoryCommandValidator : AbstractValidator<DisableEventCategoryCommand>
{
    public DisableEventCategoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
