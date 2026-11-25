using Market.Domain.Common;

namespace Market.Domain.Entities.Catalog;

/// <summary>
/// Represents a venue (hall, stadium, club) where events are held. A venue belongs to exactly one city.
/// </summary>
public class VenueEntity : BaseEntity
{
    /// <summary>
    /// Name of the venue.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Street address of the venue.
    /// </summary>
    public string Address { get; set; } = string.Empty;

    /// <summary>
    /// Foreign key to the city the venue is in.
    /// </summary>
    public int CityId { get; set; }

    /// <summary>
    /// The city the venue is in.
    /// </summary>
    public CityEntity City { get; set; } = null!;

    /// <summary>
    /// Indicates whether the venue is active (enabled).
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Single source of truth for technical/business constraints.
    /// Used in validators and EF configuration.
    /// </summary>
    public static class Constraints
    {
        public const int NameMaxLength = 150;
        public const int AddressMaxLength = 200;
    }
}