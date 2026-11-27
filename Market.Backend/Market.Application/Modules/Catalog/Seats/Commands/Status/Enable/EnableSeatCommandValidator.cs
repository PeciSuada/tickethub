namespace Market.Application.Modules.Catalog.Seats.Commands.Status.Enable;

public sealed class EnableSeatCommandValidator : AbstractValidator<EnableSeatCommand>
{
    public EnableSeatCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
