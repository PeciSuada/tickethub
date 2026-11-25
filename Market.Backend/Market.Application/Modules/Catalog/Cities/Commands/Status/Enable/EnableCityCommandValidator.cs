namespace Market.Application.Modules.Catalog.Cities.Commands.Status.Enable;

public sealed class EnableCityCommandValidator : AbstractValidator<EnableCityCommand>
{
    public EnableCityCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
