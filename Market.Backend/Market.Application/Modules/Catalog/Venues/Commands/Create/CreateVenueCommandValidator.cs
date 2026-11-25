namespace Market.Application.Modules.Catalog.Venues.Commands.Create;

public sealed class CreateVenueCommandValidator : AbstractValidator<CreateVenueCommand>
{
    public CreateVenueCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Naziv je obavezan.")
            .MaximumLength(VenueEntity.Constraints.NameMaxLength).WithMessage($"Naziv mo\u017ee imati najvi\u0161e {VenueEntity.Constraints.NameMaxLength} znakova.");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Adresa je obavezna.")
            .MaximumLength(VenueEntity.Constraints.AddressMaxLength).WithMessage($"Adresa mo\u017ee imati najvi\u0161e {VenueEntity.Constraints.AddressMaxLength} znakova.");

        RuleFor(x => x.CityId)
            .GreaterThan(0).WithMessage("Grad je obavezan.");
    }
}