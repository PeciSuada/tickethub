namespace Market.Infrastructure.Database.Configurations.Catalog;

public class VenueConfiguration : IEntityTypeConfiguration<VenueEntity>
{
    public void Configure(EntityTypeBuilder<VenueEntity> builder)
    {
        builder
            .ToTable("Venues");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(VenueEntity.Constraints.NameMaxLength);

        builder
            .Property(x => x.Address)
            .IsRequired()
            .HasMaxLength(VenueEntity.Constraints.AddressMaxLength);

        builder
            .Property(x => x.IsEnabled)
            .IsRequired();

        // A city that still has venues cannot be removed by the database.
        builder
            .HasOne(x => x.City)
            .WithMany()
            .HasForeignKey(x => x.CityId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}