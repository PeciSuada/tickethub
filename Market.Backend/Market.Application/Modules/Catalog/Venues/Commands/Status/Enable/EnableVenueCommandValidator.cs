namespace Market.Application.Modules.Catalog.Venues.Commands.Status.Enable;

public sealed class EnableVenueCommandValidator : AbstractValidator<EnableVenueCommand>
{
    public EnableVenueCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
