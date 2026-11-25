namespace Market.Application.Modules.Catalog.EventCategories.Commands.Status.Enable;

public sealed class EnableEventCategoryCommandValidator : AbstractValidator<EnableEventCategoryCommand>
{
    public EnableEventCategoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
