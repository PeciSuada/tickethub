namespace Market.Application.Modules.Catalog.Seats.Commands.Generate;

public sealed class GenerateSeatsCommandValidator : AbstractValidator<GenerateSeatsCommand>
{
    public const int MaxRows = 26;
    public const int MaxSeatsPerRow = 100;

    public GenerateSeatsCommandValidator()
    {
        RuleFor(x => x.SectorId)
            .GreaterThan(0).WithMessage("Sektor je obavezan.");

        RuleFor(x => x.SeatCategoryId)
            .GreaterThan(0).WithMessage("Kategorija sjedi\u0161ta je obavezna.");

        RuleFor(x => x.FirstRow)
            .NotEmpty().WithMessage("Prvi red je obavezan.")
            .Matches("^[A-Za-z]$").WithMessage("Prvi red mora biti jedno slovo (A-Z).");

        RuleFor(x => x.RowCount)
            .InclusiveBetween(1, MaxRows).WithMessage($"Broj redova mora biti izme\u0111u 1 i {MaxRows}.");

        RuleFor(x => x.SeatsPerRow)
            .InclusiveBetween(1, MaxSeatsPerRow).WithMessage($"Broj sjedi\u0161ta u redu mora biti izme\u0111u 1 i {MaxSeatsPerRow}.");

        // Rows are letters A-Z, so the last row must still be a letter.
        RuleFor(x => x)
            .Must(x => string.IsNullOrEmpty(x.FirstRow) || x.FirstRow.Length != 1 || !char.IsLetter(x.FirstRow[0])
                || (char.ToUpperInvariant(x.FirstRow[0]) - 'A') + x.RowCount <= MaxRows)
            .OverridePropertyName(nameof(GenerateSeatsCommand.RowCount))
            .WithMessage("Redovi bi pro\u0161li slovo Z. Smanjite broj redova ili po\u010dnite od ranijeg slova.");
    }
}