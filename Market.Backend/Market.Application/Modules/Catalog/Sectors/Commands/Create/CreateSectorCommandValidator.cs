namespace Market.Application.Modules.Catalog.Sectors.Commands.Create;

public sealed class CreateSectorCommandValidator : AbstractValidator<CreateSectorCommand>
{
    public CreateSectorCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(SectorEntity.Constraints.NameMaxLength).WithMessage($"Naziv mo\u017ee imati najvi\u0161e {SectorEntity.Constraints.NameMaxLength} znakova.");

        RuleFor(x => x.VenueId)
            .GreaterThan(0).WithMessage("Dvorana je obavezna.");
    }
}