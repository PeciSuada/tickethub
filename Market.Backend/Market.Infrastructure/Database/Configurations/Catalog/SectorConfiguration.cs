namespace Market.Infrastructure.Database.Configurations.Catalog;

public class SectorConfiguration : IEntityTypeConfiguration<SectorEntity>
{
    public void Configure(EntityTypeBuilder<SectorEntity> builder)
    {
        builder
            .ToTable("Sectors");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(SectorEntity.Constraints.NameMaxLength);

        builder
            .Property(x => x.IsEnabled)
            .IsRequired();

        // A venue that still has sectors cannot be removed by the database.
        builder
            .HasOne(x => x.Venue)
            .WithMany()
            .HasForeignKey(x => x.VenueId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}