namespace Market.Application.Modules.Catalog.EventCategories.Commands.Create;

public sealed class CreateEventCategoryCommandValidator
    : AbstractValidator<CreateEventCategoryCommand>
{
    public CreateEventCategoryCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(EventCategoryEntity.Constraints.NameMaxLength).WithMessage($"Naziv može imati najviše {EventCategoryEntity.Constraints.NameMaxLength} znakova.");
    }
}
