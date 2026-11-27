using Market.Domain.Common;

namespace Market.Domain.Entities.Catalog;

/// <summary>
/// Represents one physical seat in a sector (row + number).
/// The seat category (VIP, Floor, ...) decides which price from the price list applies to it.
/// </summary>
public class SeatEntity : BaseEntity
{
    /// <summary>
    /// Foreign key to the sector the seat is in.
    /// </summary>
    public int SectorId { get; set; }

    /// <summary>
    /// The sector the seat is in.
    /// </summary>
    public SectorEntity Sector { get; set; } = null!;

    /// <summary>
    /// Foreign key to the seat category (links the seat to the price list).
    /// </summary>
    public int SeatCategoryId { get; set; }

    /// <summary>
    /// The seat category of this seat.
    /// </summary>
    public SeatCategoryEntity SeatCategory { get; set; } = null!;

    /// <summary>
    /// Row label, e.g. "A" or "12".
    /// </summary>
    public string RowLabel { get; set; } = string.Empty;

    /// <summary>
    /// Seat number inside the row.
    /// </summary>
    public int Number { get; set; }

    /// <summary>
    /// Indicates whether the seat can be sold (a broken or blocked seat is disabled).
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Single source of truth for technical/business constraints.
    /// Used in validators and EF configuration.
    /// </summary>
    public static class Constraints
    {
        public const int RowLabelMaxLength = 10;
        public const int NumberMax = 1000;
        public const string RowLabelPattern = "^[A-Za-z0-9]+$";
    }
}