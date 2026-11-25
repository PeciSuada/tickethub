using Market.Domain.Common;

namespace Market.Domain.Entities.Catalog;

/// <summary>
/// Represents an event category (for example Concert, Sport, Theatre).
/// </summary>
public class EventCategoryEntity : BaseEntity
{
    /// <summary>
    /// Name of the category.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Indicates whether the category is active (enabled).
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Single source of truth for technical/business constraints.
    /// Used in validators and EF configuration.
    /// </summary>
    public static class Constraints
    {
        public const int NameMaxLength = 100;
    }
}