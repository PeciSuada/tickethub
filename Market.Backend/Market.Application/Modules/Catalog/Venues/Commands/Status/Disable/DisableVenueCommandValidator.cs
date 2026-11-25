namespace Market.Application.Modules.Catalog.Venues.Commands.Status.Disable;

public sealed class DisableVenueCommandValidator : AbstractValidator<DisableVenueCommand>
{
    public DisableVenueCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
