namespace Market.Application.Modules.Catalog.Sectors.Commands.Update;

public sealed class UpdateSectorCommandValidator : AbstractValidator<UpdateSectorCommand>
{
    public UpdateSectorCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(SectorEntity.Constraints.NameMaxLength).WithMessage($"Naziv mo\u017ee imati najvi\u0161e {SectorEntity.Constraints.NameMaxLength} znakova.");

        RuleFor(x => x.VenueId)
            .GreaterThan(0).WithMessage("Dvorana je obavezna.");
    }
}