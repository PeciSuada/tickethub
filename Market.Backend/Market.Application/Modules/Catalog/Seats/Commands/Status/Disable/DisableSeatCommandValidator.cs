namespace Market.Application.Modules.Catalog.Seats.Commands.Status.Disable;

public sealed class DisableSeatCommandValidator : AbstractValidator<DisableSeatCommand>
{
    public DisableSeatCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
