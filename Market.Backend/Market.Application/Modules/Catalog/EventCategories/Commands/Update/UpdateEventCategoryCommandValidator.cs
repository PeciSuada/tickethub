namespace Market.Application.Modules.Catalog.EventCategories.Commands.Update;

public sealed class UpdateEventCategoryCommandValidator
    : AbstractValidator<UpdateEventCategoryCommand>
{
    public UpdateEventCategoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(EventCategoryEntity.Constraints.NameMaxLength).WithMessage($"Naziv može imati najviše {EventCategoryEntity.Constraints.NameMaxLength} znakova.");
    }
}
