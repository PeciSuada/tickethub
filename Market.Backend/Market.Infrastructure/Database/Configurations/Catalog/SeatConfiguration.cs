namespace Market.Infrastructure.Database.Configurations.Catalog;

public class SeatConfiguration : IEntityTypeConfiguration<SeatEntity>
{
    public void Configure(EntityTypeBuilder<SeatEntity> builder)
    {
        builder
            .ToTable("Seats");

        builder
            .Property(x => x.RowLabel)
            .IsRequired()
            .HasMaxLength(SeatEntity.Constraints.RowLabelMaxLength);

        builder
            .Property(x => x.Number)
            .IsRequired();

        builder
            .Property(x => x.IsEnabled)
            .IsRequired();

        // A sector or a seat category that still has seats cannot be removed by the database.
        builder
            .HasOne(x => x.Sector)
            .WithMany()
            .HasForeignKey(x => x.SectorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.SeatCategory)
            .WithMany()
            .HasForeignKey(x => x.SeatCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // One physical seat exists only once: (sector, row, number) is unique.
        // The filter ignores soft-deleted seats, so a deleted seat can be created again.
        builder
            .HasIndex(x => new { x.SectorId, x.RowLabel, x.Number })
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");
    }
}