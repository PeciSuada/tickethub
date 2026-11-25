using Market.Domain.Common;

namespace Market.Domain.Entities.Catalog;

/// <summary>
/// Represents a category of seats in a venue (for example VIP, Floor, Balcony).
/// Seats belong to a category and each category gets its own price for an event.
/// </summary>
public class SeatCategoryEntity : BaseEntity
{
    /// <summary>
    /// Name of the seat category.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Color used for this category on the seat map, in #RRGGBB format.
    /// </summary>
    public string ColorHex { get; set; } = "#3F51B5";

    /// <summary>
    /// Indicates whether the seat category is active (enabled).
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Single source of truth for technical/business constraints.
    /// Used in validators and EF configuration.
    /// </summary>
    public static class Constraints
    {
        public const int NameMaxLength = 100;
        public const int ColorHexLength = 7;
        public const string ColorHexPattern = "^#[0-9A-Fa-f]{6}$";
    }
}