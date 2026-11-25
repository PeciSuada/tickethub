namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Create;

public sealed class CreateSeatCategoryCommandValidator : AbstractValidator<CreateSeatCategoryCommand>
{
    public CreateSeatCategoryCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(SeatCategoryEntity.Constraints.NameMaxLength).WithMessage($"Naziv mo\u017ee imati najvi\u0161e {SeatCategoryEntity.Constraints.NameMaxLength} znakova.");

        RuleFor(x => x.ColorHex)
            .NotEmpty().WithMessage("Boja je obavezna.")
            .Matches(SeatCategoryEntity.Constraints.ColorHexPattern).WithMessage("Boja mora biti u formatu #RRGGBB (npr. #FF9800).");
    }
}