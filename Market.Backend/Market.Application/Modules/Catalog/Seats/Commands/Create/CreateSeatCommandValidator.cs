namespace Market.Application.Modules.Catalog.Seats.Commands.Create;

public sealed class CreateSeatCommandValidator : AbstractValidator<CreateSeatCommand>
{
    public CreateSeatCommandValidator()
    {
        RuleFor(x => x.SectorId)
            .GreaterThan(0).WithMessage("Sektor je obavezan.");

        RuleFor(x => x.SeatCategoryId)
            .GreaterThan(0).WithMessage("Kategorija sjedi\u0161ta je obavezna.");

        RuleFor(x => x.RowLabel)
            .NotEmpty().WithMessage("Red je obavezan.")
            .MaximumLength(SeatEntity.Constraints.RowLabelMaxLength).WithMessage($"Red mo\u017ee imati najvi\u0161e {SeatEntity.Constraints.RowLabelMaxLength} znakova.")
            .Matches(SeatEntity.Constraints.RowLabelPattern).WithMessage("Red mo\u017ee sadr\u017eavati samo slova i cifre.");

        RuleFor(x => x.Number)
            .InclusiveBetween(1, SeatEntity.Constraints.NumberMax).WithMessage($"Broj sjedi\u0161ta mora biti izme\u0111u 1 i {SeatEntity.Constraints.NumberMax}.");
    }
}