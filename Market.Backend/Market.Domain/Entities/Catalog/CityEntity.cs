using Market.Domain.Common;

namespace Market.Domain.Entities.Catalog;

/// <summary>
/// Represents a city where venues are located.
/// </summary>
public class CityEntity : BaseEntity
{
    /// <summary>
    /// Name of the city.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Indicates whether the city is active (enabled).
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