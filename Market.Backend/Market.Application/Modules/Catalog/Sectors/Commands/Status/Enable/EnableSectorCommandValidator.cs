namespace Market.Application.Modules.Catalog.Sectors.Commands.Status.Enable;

public sealed class EnableSectorCommandValidator : AbstractValidator<EnableSectorCommand>
{
    public EnableSectorCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
