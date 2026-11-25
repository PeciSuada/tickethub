namespace Market.Application.Modules.Catalog.Cities.Commands.Status.Disable;

public sealed class DisableCityCommandValidator : AbstractValidator<DisableCityCommand>
{
    public DisableCityCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
