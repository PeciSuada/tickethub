namespace Market.Application.Modules.Catalog.SeatCategories.Commands.Update;

public sealed class UpdateSeatCategoryCommandValidator : AbstractValidator<UpdateSeatCategoryCommand>
{
    public UpdateSeatCategoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(SeatCategoryEntity.Constraints.NameMaxLength).WithMessage($"Naziv mo\u017ee imati najvi\u0161e {SeatCategoryEntity.Constraints.NameMaxLength} znakova.");

        RuleFor(x => x.ColorHex)
            .NotEmpty().WithMessage("Boja je obavezna.")
            .Matches(SeatCategoryEntity.Constraints.ColorHexPattern).WithMessage("Boja mora biti u formatu #RRGGBB (npr. #FF9800).");
    }
}