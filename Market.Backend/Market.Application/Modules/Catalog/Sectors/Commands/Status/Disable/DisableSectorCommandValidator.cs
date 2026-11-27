namespace Market.Application.Modules.Catalog.Sectors.Commands.Status.Disable;

public sealed class DisableSectorCommandValidator : AbstractValidator<DisableSectorCommand>
{
    public DisableSectorCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
