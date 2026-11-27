using Market.Domain.Common;

namespace Market.Domain.Entities.Catalog;

/// <summary>
/// Represents a part of a venue (e.g. Floor, Balcony, North stand). A sector belongs to exactly one venue.
/// </summary>
public class SectorEntity : BaseEntity
{
    /// <summary>
    /// Name of the sector.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Foreign key to the venue the sector is in.
    /// </summary>
    public int VenueId { get; set; }

    /// <summary>
    /// The venue the sector is in.
    /// </summary>
    public VenueEntity Venue { get; set; } = null!;

    /// <summary>
    /// Indicates whether the sector is active (enabled).
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