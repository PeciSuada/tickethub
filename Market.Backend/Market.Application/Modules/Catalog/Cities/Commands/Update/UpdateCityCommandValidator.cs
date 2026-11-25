namespace Market.Application.Modules.Catalog.Cities.Commands.Update;

public sealed class UpdateCityCommandValidator
    : AbstractValidator<UpdateCityCommand>
{
    public UpdateCityCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(CityEntity.Constraints.NameMaxLength).WithMessage($"Naziv može imati najviše {CityEntity.Constraints.NameMaxLength} znakova.");
    }
}
