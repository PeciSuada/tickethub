namespace Market.Application.Modules.Catalog.Cities.Commands.Create;

public sealed class CreateCityCommandValidator
    : AbstractValidator<CreateCityCommand>
{
    public CreateCityCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(CityEntity.Constraints.NameMaxLength).WithMessage($"Naziv može imati najviše {CityEntity.Constraints.NameMaxLength} znakova.");
    }
}
